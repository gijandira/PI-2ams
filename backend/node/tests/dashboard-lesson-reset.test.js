const test = require('node:test');
const assert = require('node:assert/strict');

const db = require('../config/db');
const dashboardController = require('../controllers/dashboardcontroller');

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

test('reinicia somente as atividades da seção Sentimentos do aluno autorizado', async () => {
  const originalQuery = db.query;
  const queries = [];
  db.query = async (sql, params) => {
    queries.push({ sql, params });
    if (sql.includes('FROM ALUNO_USUARIO')) return [[{ ALU_ID: 12 }]];
    return [{ affectedRows: 5 }];
  };

  try {
    const response = buildResponse();
    await dashboardController.reiniciarLicoes({
      body: { alunoId: 12, categoria: 'sentimentos' },
      userId: 7,
      userTipo: 'responsavel'
    }, response);

    assert.equal(response.statusCode, null);
    assert.deepEqual(response.payload, { sucesso: true, atividadesReiniciadas: 5 });
    assert.equal(queries.length, 2);
    assert.match(queries[1].sql, /DELETE sessao/);
    assert.deepEqual(queries[1].params, [
      12,
      'sentimentos',
      'Sentimentos - Fase 1',
      'Sentimentos - Fase 2',
      'Sentimentos - Fase 3',
      'Sentimentos - Fase 4',
      'Sentimentos - Fase 5',
      'Sentimentos - Histórico legado'
    ]);
  } finally {
    db.query = originalQuery;
  }
});

test('reinicia as cinco atividades da seção Necessidades', async () => {
  const originalQuery = db.query;
  const queries = [];
  db.query = async (sql, params) => {
    queries.push({ sql, params });
    if (sql.includes('FROM ALUNO_USUARIO')) return [[{ ALU_ID: 12 }]];
    return [{ affectedRows: 5 }];
  };

  try {
    const response = buildResponse();
    await dashboardController.reiniciarLicoes({
      body: { alunoId: 12, categoria: 'necessidades' },
      userId: 7,
      userTipo: 'responsavel'
    }, response);

    assert.equal(response.statusCode, null);
    assert.equal(response.payload.atividadesReiniciadas, 5);
    assert.deepEqual(queries[1].params, [
      12,
      'necessidades',
      'Necessidades - Fase 1',
      'Necessidades - Fase 2',
      'Necessidades - Fase 3',
      'Necessidades - Fase 4',
      'Necessidades - Fase 5'
    ]);
  } finally {
    db.query = originalQuery;
  }
});

test('não reinicia seção inválida nem atividades de aluno não autorizado', async () => {
  const originalQuery = db.query;
  let deleteExecutada = false;
  db.query = async sql => {
    if (sql.includes('FROM ALUNO_USUARIO')) return [[]];
    deleteExecutada = true;
    return [{ affectedRows: 0 }];
  };

  try {
    const secaoInvalida = buildResponse();
    await dashboardController.reiniciarLicoes({
      body: { alunoId: 12, categoria: 'acoes' },
      userId: 7,
      userTipo: 'responsavel'
    }, secaoInvalida);
    assert.equal(secaoInvalida.statusCode, 400);

    const naoAutorizado = buildResponse();
    await dashboardController.reiniciarLicoes({
      body: { alunoId: 12, categoria: 'necessidades' },
      userId: 7,
      userTipo: 'responsavel'
    }, naoAutorizado);
    assert.equal(naoAutorizado.statusCode, 403);
    assert.equal(deleteExecutada, false);
  } finally {
    db.query = originalQuery;
  }
});
