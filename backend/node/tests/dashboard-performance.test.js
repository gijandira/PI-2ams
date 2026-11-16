const test = require('node:test');
const assert = require('node:assert/strict');

const db = require('../config/db');
const dashboardController = require('../controllers/dashboardcontroller');
const sectionAccessService = require('../services/sectionAccessService');

function buildResponse() {
  return {
    statusCode: null,
    payload: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.payload = data;
      return this;
    }
  };
}

function stubDashboardQueries({ resumo, evolucao = [], recentes = [] }, queries) {
  db.query = async (sql, params) => {
    queries.push({ sql, params });
    if (sql.includes('FROM ALUNO_USUARIO')) return [[{ ALU_ID: 12 }]];
    if (sql.includes('FROM ALUNO a')) {
      return [[{
        id: 12,
        nome: 'Aluno de teste',
        avatar: null,
        xp: 0,
        diasOfensiva: 0,
        responsavelNome: 'Responsável',
        responsavelTelefone: null
      }]];
    }
    if (sql.includes('COUNT(*) AS licoes')) return [[resumo]];
    if (sql.includes('FROM CATEGORIA c')) return [[]];
    if (sql.includes('s.USU_ID IS NOT NULL AS responsavelPresente')) return [recentes];
    if (sql.includes('SES_FEEDBACK_RESPONSAVEL AS resposta')) return [[]];
    if (sql.includes('s.SES_ACERTOS AS acertos')) return [evolucao];
    throw new Error(`Consulta inesperada no teste: ${sql}`);
  };
};

test('relatório soma acertos e erros e devolve resultados em ordem temporal', async () => {
  const originalQuery = db.query;
  const queries = [];
  stubDashboardQueries({
    resumo: { licoes: 2, acertos: 3, erros: 1, perguntas: 4 },
    evolucao: [
      { id: 20, titulo: 'Atividade antiga', data: '2026-11-02 10:00:00', acertos: '1', erros: '1', totalPerguntas: '2' },
      { id: 21, titulo: 'Atividade recente', data: '2026-11-03 10:00:00', acertos: '2', erros: '0', totalPerguntas: '2' }
    ]
  }, queries);

  try {
    const response = buildResponse();
    await dashboardController.obterDashboardAluno({
      query: { alunoId: '12', periodo: 'semana' },
      userId: 7,
      userTipo: 'responsavel'
    }, response);

    assert.equal(response.statusCode, null);
    assert.equal(response.payload.resumo.acertos, 3);
    assert.equal(response.payload.resumo.erros, 1);
    assert.equal(response.payload.resumo.taxaAcerto, 75);
    assert.deepEqual(response.payload.evolucao.map(item => item.id), [20, 21]);
    assert.equal(response.payload.evolucao[0].acertos, 1);
    assert.equal(response.payload.evolucao[0].erros, 1);

    const categoryQuery = queries.find(({ sql }) => sql.includes('SELECT MIN(c.CAT_ID)'));
    assert.ok(categoryQuery);
    assert.match(categoryQuery.sql, /GROUP BY LOWER\(TRIM\(REPLACE\(c\.CAT_NOME/);
    assert.match(categoryQuery.sql, /COUNT\(DISTINCT a\.ATI_ID\)/);

    const performanceQueries = queries.filter(({ sql }) => (
      sql.includes('COUNT(*) AS licoes') || sql.includes('s.SES_ACERTOS AS acertos')
    ));
    assert.equal(performanceQueries.length, 2);
    for (const { sql, params } of performanceQueries) {
      assert.match(sql, /s\.ALU_ID = \?/);
      assert.match(sql, /s\.SES_TOTALPERGUNTAS > 0/);
      assert.match(sql, /s\.SES_DTINICIO >= \? AND s\.SES_DTINICIO <= \?/);
      assert.equal(params[0], 12);
      assert.ok(params[1] instanceof Date);
      assert.ok(params[2] instanceof Date);
      assert.ok(params[1] < params[2]);
    }
  } finally {
    db.query = originalQuery;
  }
});

test('relatório de período sem resultados retorna contadores e evolução vazios', async () => {
  const originalQuery = db.query;
  const queries = [];
  stubDashboardQueries({
    resumo: { licoes: 0, acertos: 0, erros: 0, perguntas: 0 }
  }, queries);

  try {
    const response = buildResponse();
    await dashboardController.obterDashboardAluno({
      query: { alunoId: '12', periodo: 'mes' },
      userId: 7,
      userTipo: 'responsavel'
    }, response);

    assert.equal(response.statusCode, null);
    assert.equal(response.payload.resumo.acertos, 0);
    assert.equal(response.payload.resumo.erros, 0);
    assert.deepEqual(response.payload.evolucao, []);
    assert.match(
      queries.find(({ sql }) => sql.includes('COUNT(*) AS licoes')).sql,
      /s\.SES_TOTALPERGUNTAS > 0/
    );
  } finally {
    db.query = originalQuery;
  }
});

test('não calcula relatório para aluno sem vínculo com o responsável', async () => {
  const originalQuery = db.query;
  const queries = [];
  db.query = async (sql, params) => {
    queries.push({ sql, params });
    return [[]];
  };

  try {
    const response = buildResponse();
    await dashboardController.obterDashboardAluno({
      query: { alunoId: '99', periodo: 'total' },
      userId: 7,
      userTipo: 'responsavel'
    }, response);

    assert.equal(response.statusCode, 403);
    assert.equal(response.payload.erro, 'Aluno não autorizado.');
    assert.equal(queries.length, 1);
  } finally {
    db.query = originalQuery;
  }
});

test('rejeita resultados de atividade inconsistentes antes de gravar', async () => {
  const originalQuery = db.query;
  let queryExecutada = false;
  db.query = async () => {
    queryExecutada = true;
    return [[]];
  };

  try {
    const response = buildResponse();
    await dashboardController.registrarSessaoAtividade({
      body: { acertos: 2, totalPerguntas: 1 },
      userId: 7,
      userTipo: 'responsavel'
    }, response);

    assert.equal(response.statusCode, 400);
    assert.equal(response.payload.erro, 'Resultado da atividade inválido.');
    assert.equal(queryExecutada, false);
  } finally {
    db.query = originalQuery;
  }
});

test('só considera a seção Sentimentos concluída com sessões totalmente corretas', async () => {
  const originalQuery = db.query;
  let queryExecutada;
  db.query = async (sql, params) => {
    queryExecutada = { sql, params };
    return [[{ concluidas: 4 }]];
  };

  try {
    const concluida = await sectionAccessService.secaoSentimentosConcluida(12);

    assert.equal(concluida, false);
    assert.match(queryExecutada.sql, /SES_TOTALPERGUNTAS > 0/);
    assert.match(queryExecutada.sql, /SES_ACERTOS >= s\.SES_TOTALPERGUNTAS/);
    assert.equal(queryExecutada.params[0], 12);
  } finally {
    db.query = originalQuery;
  }
});

test('bloqueia o registro da fase seguinte enquanto a anterior não foi concluída', async () => {
  const originalQuery = db.query;
  const queries = [];
  db.query = async (sql, params) => {
    queries.push({ sql, params });
    if (sql.includes('SELECT ATI_ID FROM ATIVIDADE WHERE ATI_ID =')) {
      return [[{ ATI_ID: 2 }]];
    }
    if (sql.includes('SELECT ALU_ID, ALU_XP_TOTAL')) {
      return [[{ ALU_ID: 12, ALU_XP_TOTAL: 0, ALU_DIAS_OFENSIVA: 0 }]];
    }
    if (sql.includes('SELECT ALU_ID FROM ALUNO_USUARIO')) {
      return [[{ ALU_ID: 12 }]];
    }
    if (sql.includes('SELECT ATI_ID FROM ATIVIDADE WHERE ATI_TITULO')) {
      return [[{ ATI_ID: 2 }]];
    }
    if (sql.includes('AS fasesConcluidas')) {
      return [[{ fasesConcluidas: 0 }]];
    }
    throw new Error(`Consulta inesperada no teste: ${sql}`);
  };

  try {
    const response = buildResponse();
    await dashboardController.registrarSessaoAtividade({
      body: {
        alunoId: 12,
        atividadeId: 2,
        categoria: 'Sentimentos',
        fase: 2,
        acertos: 1,
        totalPerguntas: 1
      },
      userId: 7,
      userTipo: 'responsavel'
    }, response);

    assert.equal(response.statusCode, 409);
    assert.match(response.payload.erro, /fase anterior/);
    assert.equal(queries.some(({ sql }) => sql.includes('INSERT INTO SESSAO_ATIVIDADE')), false);
    assert.match(queries.at(-1).sql, /SES_ACERTOS >= s\.SES_TOTALPERGUNTAS/);
    assert.deepEqual(queries.at(-1).params, [
      12,
      'Sentimentos - Fase 1',
      'Sentimentos - Histórico legado'
    ]);
  } finally {
    db.query = originalQuery;
  }
});

test('exige avaliação positiva do responsável para concluir uma lição', async () => {
  const originalQuery = db.query;
  const queries = [];
  db.query = async (sql, params) => {
    queries.push({ sql, params });
    if (sql.includes('SELECT ATI_ID FROM ATIVIDADE WHERE ATI_ID =')) return [[{ ATI_ID: 1 }]];
    if (sql.includes('SELECT ALU_ID, ALU_XP_TOTAL')) {
      return [[{ ALU_ID: 12, ALU_XP_TOTAL: 0, ALU_DIAS_OFENSIVA: 0 }]];
    }
    if (sql.includes('SELECT ALU_ID FROM ALUNO_USUARIO')) return [[{ ALU_ID: 12 }]];
    if (sql.includes('SELECT ATI_ID FROM ATIVIDADE WHERE ATI_TITULO')) return [[{ ATI_ID: 1 }]];
    throw new Error(`Consulta inesperada no teste: ${sql}`);
  };

  try {
    const response = buildResponse();
    await dashboardController.registrarSessaoAtividade({
      body: {
        alunoId: 12,
        atividadeId: 1,
        categoria: 'Sentimentos',
        fase: 1,
        acertos: 1,
        totalPerguntas: 1,
        feedbackResponsavel: 'nao'
      },
      userId: 7,
      userTipo: 'responsavel'
    }, response);

    assert.equal(response.statusCode, 400);
    assert.match(response.payload.erro, /avaliação do responsável/);
    assert.equal(queries.some(({ sql }) => sql.includes('INSERT INTO SESSAO_ATIVIDADE')), false);
  } finally {
    db.query = originalQuery;
  }
});

test('mantém a sequência no mesmo dia e reinicia após um dia sem atividade', async () => {
  const originalQuery = db.query;
  const registrar = async (atividadeOntem, diasAtuais, temAtividadeHoje = false) => {
    db.query = async sql => {
      if (sql.includes('SELECT ATI_ID FROM ATIVIDADE WHERE ATI_ID =')) return [[{ ATI_ID: 1 }]];
      if (sql.includes('SELECT ALU_ID, ALU_XP_TOTAL')) {
        return [[{ ALU_ID: 12, ALU_XP_TOTAL: 100, ALU_DIAS_OFENSIVA: diasAtuais }]];
      }
      if (sql.includes('SELECT ALU_ID FROM ALUNO_USUARIO')) return [[{ ALU_ID: 12 }]];
      if (sql.includes('SELECT ATI_ID FROM ATIVIDADE WHERE ATI_TITULO')) return [[{ ATI_ID: 1 }]];
      if (sql.includes('SELECT a.ATI_TITULO AS titulo')) {
        return [[{ titulo: 'Sentimentos - Fase 1', categoria: 'sentimentos' }]];
      }
      if (sql.includes('DATE(SES_DTINICIO) = CURDATE()')) {
        return [temAtividadeHoje ? [{ SES_ID: 41 }] : []];
      }
      if (sql.includes('MAX(DATE(SES_DTINICIO))')) return [[{ atividadeOntem }]];
      if (sql.includes('INSERT INTO SESSAO_ATIVIDADE')) return [{ insertId: 42 }];
      if (sql.includes('UPDATE ALUNO')) return [{ affectedRows: 1 }];
      throw new Error(`Consulta inesperada no teste: ${sql}`);
    };

    const response = buildResponse();
    await dashboardController.registrarSessaoAtividade({
      body: {
        alunoId: 12,
        atividadeId: 1,
        categoria: 'Sentimentos',
        fase: 1,
        acertos: 1,
        totalPerguntas: 1,
        pontos: 20,
        feedbackResponsavel: 'parcialmente'
      },
      userId: 7,
      userTipo: 'responsavel'
    }, response);
    return response;
  };

  try {
    const continued = await registrar(1, 2);
    assert.equal(continued.payload.diasOfensiva, 3);

    const sameDay = await registrar(1, 2, true);
    assert.equal(sameDay.payload.diasOfensiva, 2);

    const restarted = await registrar(0, 4);
    assert.equal(restarted.payload.diasOfensiva, 1);
  } finally {
    db.query = originalQuery;
  }
});
