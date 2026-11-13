const pool = require('../config/db');
const sectionAccessService = require('../services/sectionAccessService');
const rabbitmqService = require('../services/rabbitmqService');

const licoesNecessidades = [
  {
    fase: 1,
    emoji: '💧',
    palavra: 'Água',
    pergunta: 'O que você pode pedir quando está com sede?',
    opcoes: [
      { emoji: '💧', label: 'Água' },
      { emoji: '🍎', label: 'Comida' },
      { emoji: '🛏️', label: 'Dormir' },
      { emoji: '🧸', label: 'Brincar' }
    ]
  },
  {
    fase: 2,
    emoji: '🍎',
    palavra: 'Comida',
    pergunta: 'O que você pode pedir quando está com fome?',
    opcoes: [
      { emoji: '🚿', label: 'Banho' },
      { emoji: '🍎', label: 'Comida' },
      { emoji: '💧', label: 'Água' },
      { emoji: '🛏️', label: 'Dormir' }
    ]
  },
  {
    fase: 3,
    emoji: '😴',
    palavra: 'Dormir',
    pergunta: 'O que você pode pedir quando está com sono?',
    opcoes: [
      { emoji: '⚽', label: 'Brincar' },
      { emoji: '🍎', label: 'Comida' },
      { emoji: '😴', label: 'Dormir' },
      { emoji: '💧', label: 'Água' }
    ]
  },
  {
    fase: 4,
    emoji: '🚽',
    palavra: 'Banheiro',
    pergunta: 'O que você pode pedir quando precisa ir ao banheiro?',
    opcoes: [
      { emoji: '🧸', label: 'Brincar' },
      { emoji: '🚽', label: 'Banheiro' },
      { emoji: '🛏️', label: 'Dormir' },
      { emoji: '🍎', label: 'Comida' }
    ]
  },
  {
    fase: 5,
    emoji: '🆘',
    palavra: 'Ajuda',
    pergunta: 'O que você pode dizer quando precisa de ajuda?',
    opcoes: [
      { emoji: '✅', label: 'Está tudo bem' },
      { emoji: '🆘', label: 'Preciso de ajuda' },
      { emoji: '😴', label: 'Quero dormir' },
      { emoji: '🍎', label: 'Quero comer' }
    ]
  }
];

const licoesSentimentos = [
  { fase: 1, emoji: '😄', palavra: 'Feliz', pergunta: 'Como ele está se sentindo?' },
  { fase: 2, emoji: '😢', palavra: 'Triste', pergunta: 'Como ele está se sentindo?' },
  { fase: 3, emoji: '😠', palavra: 'Bravo', pergunta: 'Como ele está se sentindo?' },
  { fase: 4, emoji: '😨', palavra: 'Assustado', pergunta: 'Como ele está se sentindo?' },
  { fase: 5, emoji: '😴', palavra: 'Cansado', pergunta: 'Como ele está se sentindo?' }
].map(licao => {
  const opcoes = [
    { emoji: '😄', label: 'Feliz' },
    { emoji: '😢', label: 'Triste' },
    { emoji: '😨', label: 'Assustado' },
    { emoji: '😠', label: 'Bravo' },
    { emoji: '😴', label: 'Cansado' }
  ];
  return {
    ...licao,
    opcoes: [
      opcoes.find(opcao => opcao.emoji === licao.emoji),
      ...opcoes.filter(opcao => opcao.emoji !== licao.emoji).slice(0, 3)
    ]
  };
});

const titulosLicoesPorSecao = {
  sentimentos: [
    ...licoesSentimentos.map(licao => `Sentimentos - Fase ${licao.fase}`),
    'Sentimentos - Histórico legado'
  ],
  necessidades: licoesNecessidades.map(licao => `Necessidades - Fase ${licao.fase}`)
};

const obterIntervalo = periodo => {
  if (periodo === 'total') return { inicio: null };
  const dias = periodo === 'mes' ? 30 : 7;
  return { inicio: new Date(Date.now() - dias * 24 * 60 * 60 * 1000) };
};

exports.obterDashboardAluno = async (req, res) => {
  try {
    const alunoId = Number(req.query.alunoId);
    const periodo = String(req.query.periodo || 'semana').toLowerCase();
    const intervalo = obterIntervalo(periodo);

    if (!Number.isInteger(alunoId) || alunoId <= 0) {
      return res.status(400).json({ erro: 'ID do aluno inválido.' });
    }
    if (!['semana', 'mes', 'total'].includes(periodo)) {
      return res.status(400).json({ erro: 'Período inválido.' });
    }

    let autorizada;
    if (req.userTipo === 'instituicao') {
      [autorizada] = await pool.query(
        `SELECT SOL_ID FROM SOLICITACAO_AFILIACAO
         WHERE ALU_ID = ? AND INS_ID = ? AND SOL_STATUS = 'aceito' LIMIT 1`,
        [alunoId, req.userId]
      );
    } else {
      [autorizada] = await pool.query(
        `SELECT ALU_ID FROM ALUNO_USUARIO WHERE ALU_ID = ? AND USU_ID = ? LIMIT 1`,
        [alunoId, req.userId]
      );
    }
    if (autorizada.length === 0) return res.status(403).json({ erro: 'Aluno não autorizado.' });

    const [alunos] = await pool.query(
      `SELECT a.ALU_ID AS id, a.ALU_NOME AS nome, a.ALU_URLAVATAR AS avatar,
              a.ALU_XP_TOTAL AS xp, a.ALU_DIAS_OFENSIVA AS diasOfensiva,
              u.USU_NOME AS responsavelNome, u.USU_TELEFONE AS responsavelTelefone
       FROM ALUNO a
       LEFT JOIN ALUNO_USUARIO au ON au.ALU_ID = a.ALU_ID
       LEFT JOIN USUARIO u ON u.USU_ID = au.USU_ID
       WHERE a.ALU_ID = ? LIMIT 1`,
      [alunoId]
    );
    if (alunos.length === 0) return res.status(404).json({ erro: 'Aluno não encontrado.' });

    const params = intervalo.inicio ? [alunoId, intervalo.inicio] : [alunoId];
    const dateClause = intervalo.inicio ? 'AND s.SES_DTINICIO >= ?' : '';
    const [resumo] = await pool.query(
      `SELECT COUNT(*) AS licoes, COALESCE(SUM(s.SES_ACERTOS), 0) AS acertos,
              COALESCE(SUM(s.SES_TOTALPERGUNTAS), 0) AS perguntas
       FROM SESSAO_ATIVIDADE s WHERE s.ALU_ID = ? ${dateClause}`,
      params
    );
    const [categorias] = await pool.query(
      `SELECT c.CAT_ID AS id, c.CAT_NOME AS nome, c.CAT_SLUG AS slug, c.CAT_ICONE AS icone,
              COUNT(DISTINCT a.ATI_ID) AS total,
              COUNT(DISTINCT CASE WHEN s.SES_ID IS NOT NULL THEN a.ATI_ID END) AS concluidas
       FROM CATEGORIA c
       LEFT JOIN SUBCATEGORIA sub ON sub.CAT_ID = c.CAT_ID
       LEFT JOIN ATIVIDADE a ON a.SUB_ID = sub.SUB_ID
       LEFT JOIN SESSAO_ATIVIDADE s ON s.ATI_ID = a.ATI_ID AND s.ALU_ID = ? ${intervalo.inicio ? 'AND s.SES_DTINICIO >= ?' : ''}
       GROUP BY c.CAT_ID, c.CAT_NOME, c.CAT_SLUG, c.CAT_ICONE ORDER BY c.CAT_ID`,
      intervalo.inicio ? [alunoId, intervalo.inicio] : [alunoId]
    );
    const [feedback] = await pool.query(
      `SELECT s.SES_FEEDBACK_RESPONSAVEL AS resposta, COUNT(*) AS quantidade
       FROM SESSAO_ATIVIDADE s WHERE s.ALU_ID = ? AND s.SES_FEEDBACK_RESPONSAVEL IS NOT NULL ${dateClause}
       GROUP BY s.SES_FEEDBACK_RESPONSAVEL`,
      params
    );
    const [recentes] = await pool.query(
      `SELECT s.SES_ID AS id, a.ATI_TITULO AS titulo, s.SES_DTINICIO AS data,
              s.SES_FEEDBACK_RESPONSAVEL AS resposta, s.USU_ID IS NOT NULL AS responsavelPresente
       FROM SESSAO_ATIVIDADE s INNER JOIN ATIVIDADE a ON a.ATI_ID = s.ATI_ID
       WHERE s.ALU_ID = ? ${dateClause} ORDER BY s.SES_DTINICIO DESC LIMIT 10`,
      params
    );

    const totalFeedback = feedback.reduce((sum, item) => sum + Number(item.quantidade), 0);
    const respostas = ['sim', 'parcialmente', 'quase', 'nao'].map(resposta => ({
      resposta,
      quantidade: Number(feedback.find(item => item.resposta === resposta)?.quantidade || 0),
      percentual: totalFeedback ? Math.round((Number(feedback.find(item => item.resposta === resposta)?.quantidade || 0) / totalFeedback) * 100) : 0
    }));
    const totalPerguntas = Number(resumo[0].perguntas);

    res.json({
      aluno: alunos[0],
      periodo,
      resumo: {
        licoes: Number(resumo[0].licoes),
        acertos: Number(resumo[0].acertos),
        xp: Number(alunos[0].xp || 0),
        diasOfensiva: Number(alunos[0].diasOfensiva || 0),
        taxaAcerto: totalPerguntas ? Math.round((Number(resumo[0].acertos) / totalPerguntas) * 100) : 0
      },
      categorias: categorias.map(item => ({ ...item, total: Number(item.total), concluidas: Number(item.concluidas), percentual: Number(item.total) ? Math.round((Number(item.concluidas) / Number(item.total)) * 100) : 0 })),
      feedback: respostas,
      recentes
    });
  } catch (error) {
    console.error('Erro ao carregar dashboard do aluno:', error);
    res.status(500).json({ erro: 'Erro ao carregar dashboard do aluno.' });
  }
};

exports.obterLicoes = async (req, res) => {
  try {
    const alunoId = Number(req.query.alunoId);
    const usuarioId = Number(req.userId);

    if (!Number.isInteger(alunoId) || alunoId <= 0) {
      return res.status(400).json({ erro: 'ID do aluno inválido.' });
    }

    const [vinculo] = req.userTipo === 'instituicao'
      ? await pool.query(
          `SELECT SOL_ID FROM SOLICITACAO_AFILIACAO
           WHERE ALU_ID = ? AND INS_ID = ? AND SOL_STATUS = 'aceito' LIMIT 1`,
          [alunoId, usuarioId]
        )
      : await pool.query(
          'SELECT ALU_ID FROM ALUNO_USUARIO WHERE ALU_ID = ? AND USU_ID = ? LIMIT 1',
          [alunoId, usuarioId]
        );

    if (vinculo.length === 0) {
      return res.status(403).json({ erro: 'Aluno não autorizado.' });
    }

    const licoes = [];
    let sessoesLegadasSentimentos = false;
    const categoriasLicoes = [
      { slug: 'sentimentos', nome: 'Sentimentos', licoes: licoesSentimentos },
      { slug: 'necessidades', nome: 'Necessidades', licoes: licoesNecessidades }
    ];

    for (const categoriaLicoes of categoriasLicoes) {
      const [categorias] = await pool.query(
        'SELECT CAT_ID FROM CATEGORIA WHERE CAT_SLUG = ? LIMIT 1',
        [categoriaLicoes.slug]
      );
      if (categorias.length === 0) {
        return res.status(404).json({ erro: `Categoria ${categoriaLicoes.nome} não encontrada.` });
      }

      const categoriaId = Number(categorias[0].CAT_ID);
      const [subcategorias] = await pool.query(
        "SELECT SUB_ID FROM SUBCATEGORIA WHERE CAT_ID = ? AND SUB_NOME = 'Lições' LIMIT 1",
        [categoriaId]
      );

      let subcategoriaId = subcategorias[0]?.SUB_ID;
      if (!subcategoriaId) {
        const [novaSubcategoria] = await pool.query(
          'INSERT INTO SUBCATEGORIA (CAT_ID, SUB_NOME) VALUES (?, ?)',
          [categoriaId, 'Lições']
        );
        subcategoriaId = novaSubcategoria.insertId;
      }

      let atividadeLegadaId = null;
      if (categoriaLicoes.slug === 'sentimentos') {
        const [atividadesLegadas] = await pool.query(
          `SELECT ATI_ID FROM ATIVIDADE
           WHERE ATI_TITULO IN ('Sentimentos - Fase 4', 'Sentimentos - Histórico legado')
             AND ATI_DESCRICAO = 'Atividade inicial de sentimentos.'
           LIMIT 1`
        );
        atividadeLegadaId = atividadesLegadas[0]?.ATI_ID || null;
        if (atividadeLegadaId) {
          const [sessoesLegadas] = await pool.query(
            'SELECT SES_ID FROM SESSAO_ATIVIDADE WHERE ALU_ID = ? AND ATI_ID = ? LIMIT 1',
            [alunoId, atividadeLegadaId]
          );
          sessoesLegadasSentimentos = sessoesLegadas.length > 0;
          await pool.query(
            `UPDATE ATIVIDADE SET ATI_TITULO = 'Sentimentos - Histórico legado'
             WHERE ATI_ID = ? AND ATI_TITULO = 'Sentimentos - Fase 4'`,
            [atividadeLegadaId]
          );
        }
      }

      for (const licao of categoriaLicoes.licoes) {
        const titulo = `${categoriaLicoes.nome} - Fase ${licao.fase}`;
        const [atividades] = await pool.query(
          'SELECT ATI_ID, ATI_DESCRICAO FROM ATIVIDADE WHERE ATI_TITULO = ? ORDER BY ATI_ID LIMIT 1',
          [titulo]
        );
        let atividadeId = atividades[0]?.ATI_ID;

        if (atividadeId) {
          await pool.query(
            'UPDATE ATIVIDADE SET SUB_ID = ? WHERE ATI_ID = ? AND SUB_ID <> ?',
            [subcategoriaId, atividadeId, subcategoriaId]
          );
        } else {
          const [novaAtividade] = await pool.query(
            `INSERT INTO ATIVIDADE
              (ATI_TITULO, ATI_DESCRICAO, ATI_TIPO, SUB_ID, ATI_DIFICULDADE, ATI_MINPONTOS)
             VALUES (?, ?, 'multipla_escolha', ?, ?, 70)`,
            [titulo, licao.pergunta, subcategoriaId, licao.fase]
          );
          atividadeId = novaAtividade.insertId;
        }

        const [sessoes] = await pool.query(
          'SELECT SES_ID FROM SESSAO_ATIVIDADE WHERE ALU_ID = ? AND ATI_ID = ? LIMIT 1',
          [alunoId, atividadeId]
        );

        licoes.push({
          ...licao,
          id: Number(atividadeId),
          label: `Fase ${licao.fase}`,
          categoria: categoriaLicoes.nome,
          concluida: sessoes.length > 0 || (categoriaLicoes.slug === 'sentimentos' && licao.fase === 1 && sessoesLegadasSentimentos)
        });
      }
    }

    const acessoNecessidades = await sectionAccessService.obterAcessoNecessidades(alunoId);
    const sentimentos = licoes.filter(licao => licao.categoria === 'Sentimentos');

    return res.json({
      licoes,
      secoes: {
        sentimentosConcluida: sentimentos.length === 5 && sentimentos.every(licao => licao.concluida),
        necessidadesLiberada: acessoNecessidades.liberada,
        solicitacaoNecessidades: acessoNecessidades.solicitacao
      }
    });
  } catch (error) {
    console.error('Erro ao carregar lições:', error);
    return res.status(500).json({ erro: 'Erro ao carregar lições.' });
  }
};

exports.solicitarLiberacaoProximaSecao = async (req, res) => {
  try {
    const alunoId = Number(req.body?.alunoId);
    const usuarioId = Number(req.userId);

    if (!Number.isInteger(alunoId) || alunoId <= 0) {
      return res.status(400).json({ erro: 'ID do aluno inválido.' });
    }

    const [vinculo] = req.userTipo === 'instituicao'
      ? await pool.query(
          `SELECT SOL_ID FROM SOLICITACAO_AFILIACAO
           WHERE ALU_ID = ? AND INS_ID = ? AND SOL_STATUS = 'aceito' LIMIT 1`,
          [alunoId, usuarioId]
        )
      : await pool.query(
          'SELECT ALU_ID FROM ALUNO_USUARIO WHERE ALU_ID = ? AND USU_ID = ? LIMIT 1',
          [alunoId, usuarioId]
        );

    if (vinculo.length === 0) {
      return res.status(403).json({ erro: 'Aluno não autorizado.' });
    }

    const acessoAtual = await sectionAccessService.obterAcessoNecessidades(alunoId);
    if (acessoAtual.liberada) {
      return res.json({ sucesso: true, liberada: true });
    }

    if (!await sectionAccessService.secaoSentimentosConcluida(alunoId)) {
      return res.status(409).json({
        erro: 'Conclua todas as atividades de Sentimentos antes de solicitar a próxima seção.'
      });
    }

    await sectionAccessService.criarSolicitacaoPendente(alunoId);
    try {
      await rabbitmqService.publicarSolicitacaoLiberacao(alunoId);
    } catch (error) {
      console.error('Erro ao publicar solicitação de liberação no RabbitMQ:', error);
      return res.status(503).json({
        erro: 'A solicitação foi registrada, mas não foi possível enviá-la ao RabbitMQ. Tente novamente.'
      });
    }

    return res.status(202).json({
      sucesso: true,
      liberada: false,
      solicitacao: 'pendente'
    });
  } catch (error) {
    console.error('Erro ao solicitar liberação da próxima seção:', error);
    return res.status(500).json({ erro: 'Erro ao solicitar liberação da próxima seção.' });
  }
};

exports.reiniciarLicoes = async (req, res) => {
  try {
    const alunoId = Number(req.body?.alunoId);
    const categoria = String(req.body?.categoria || '');
    const titulos = titulosLicoesPorSecao[categoria];
    const usuarioId = Number(req.userId);

    if (!Number.isInteger(alunoId) || alunoId <= 0) {
      return res.status(400).json({ erro: 'ID do aluno inválido.' });
    }
    if (!titulos) {
      return res.status(400).json({ erro: 'Seção de lições inválida.' });
    }

    const [vinculo] = req.userTipo === 'instituicao'
      ? await pool.query(
          `SELECT SOL_ID FROM SOLICITACAO_AFILIACAO
           WHERE ALU_ID = ? AND INS_ID = ? AND SOL_STATUS = 'aceito' LIMIT 1`,
          [alunoId, usuarioId]
        )
      : await pool.query(
          'SELECT ALU_ID FROM ALUNO_USUARIO WHERE ALU_ID = ? AND USU_ID = ? LIMIT 1',
          [alunoId, usuarioId]
        );

    if (vinculo.length === 0) {
      return res.status(403).json({ erro: 'Aluno não autorizado.' });
    }

    const [resultado] = await pool.query(
      `DELETE sessao
       FROM SESSAO_ATIVIDADE sessao
       INNER JOIN ATIVIDADE atividade ON atividade.ATI_ID = sessao.ATI_ID
       INNER JOIN SUBCATEGORIA subcategoria ON subcategoria.SUB_ID = atividade.SUB_ID
       INNER JOIN CATEGORIA categoria ON categoria.CAT_ID = subcategoria.CAT_ID
       WHERE sessao.ALU_ID = ? AND categoria.CAT_SLUG = ?
         AND atividade.ATI_TITULO IN (${titulos.map(() => '?').join(', ')})`,
      [alunoId, categoria, ...titulos]
    );

    return res.json({
      sucesso: true,
      atividadesReiniciadas: Number(resultado.affectedRows || 0)
    });
  } catch (error) {
    console.error('Erro ao reiniciar atividades da seção:', error);
    return res.status(500).json({ erro: 'Erro ao reiniciar as atividades da seção.' });
  }
};

exports.registrarSessaoAtividade = async (req, res) => {
  try {
    const usuarioId = Number(req.userId);
    const alunoIdInput = req.body?.alunoId ?? req.query?.alunoId;
    let atividadeId = Number(req.body?.atividadeId || 0);
    const acertos = Number(req.body?.acertos || 0);
    const totalPerguntas = Number(req.body?.totalPerguntas || 1);
    const pontos = Number(req.body?.pontos || 0);
    const feedbackResponsavel = req.body?.feedbackResponsavel || null;

    if (!usuarioId) {
      return res.status(401).json({ erro: 'Usuário não autenticado.' });
    }

    let alunoId = Number(alunoIdInput);
    if (!Number.isInteger(alunoId) || alunoId <= 0) {
      const [vinculo] = await pool.query(
        'SELECT ALU_ID FROM ALUNO_USUARIO WHERE USU_ID = ? LIMIT 1',
        [usuarioId]
      );

      if (vinculo.length === 0) {
        return res.status(404).json({ erro: 'Aluno não encontrado para o usuário autenticado.' });
      }

      alunoId = Number(vinculo[0].ALU_ID);
    }

    const [atividades] = await pool.query(
      'SELECT ATI_ID FROM ATIVIDADE WHERE ATI_ID = ? LIMIT 1',
      [atividadeId]
    );

    if (atividades.length === 0) {
      const [primeiraAtividade] = await pool.query(
        'SELECT ATI_ID FROM ATIVIDADE ORDER BY ATI_ID LIMIT 1'
      );

      if (primeiraAtividade.length > 0) {
        atividadeId = Number(primeiraAtividade[0].ATI_ID);
      } else {
        const [categorias] = await pool.query(
          'SELECT CAT_ID FROM CATEGORIA ORDER BY CAT_ID LIMIT 1'
        );

        if (categorias.length === 0) {
          return res.status(500).json({ erro: 'Nenhuma categoria cadastrada para criar a atividade.' });
        }

        const [subcategorias] = await pool.query(
          'SELECT SUB_ID FROM SUBCATEGORIA WHERE CAT_ID = ? ORDER BY SUB_ID LIMIT 1',
          [categorias[0].CAT_ID]
        );
        let subcategoriaId = subcategorias[0]?.SUB_ID;

        if (!subcategoriaId) {
          const [novaSubcategoria] = await pool.query(
            'INSERT INTO SUBCATEGORIA (CAT_ID, SUB_NOME) VALUES (?, ?)',
            [categorias[0].CAT_ID, 'Atividades iniciais']
          );
          subcategoriaId = novaSubcategoria.insertId;
        }

        const [novaAtividade] = await pool.query(
          `INSERT INTO ATIVIDADE
            (ATI_TITULO, ATI_DESCRICAO, ATI_TIPO, SUB_ID, ATI_DIFICULDADE, ATI_MINPONTOS)
           VALUES (?, ?, 'multipla_escolha', ?, 1, 70)`,
          ['Sentimentos - Fase 4', 'Atividade inicial de sentimentos.', subcategoriaId]
        );
        atividadeId = novaAtividade.insertId;
      }
    }

    const [alunoAtual] = await pool.query(
      'SELECT ALU_ID, ALU_XP_TOTAL, ALU_DIAS_OFENSIVA FROM ALUNO WHERE ALU_ID = ? LIMIT 1',
      [alunoId]
    );

    if (alunoAtual.length === 0) {
      return res.status(404).json({ erro: 'Aluno não encontrado.' });
    }

    const [vinculoAluno] = req.userTipo === 'instituicao'
      ? await pool.query(
          `SELECT SOL_ID FROM SOLICITACAO_AFILIACAO
           WHERE ALU_ID = ? AND INS_ID = ? AND SOL_STATUS = 'aceito' LIMIT 1`,
          [alunoId, req.userId]
        )
      : await pool.query(
          `SELECT ALU_ID FROM ALUNO_USUARIO
           WHERE ALU_ID = ? AND USU_ID = ? LIMIT 1`,
          [alunoId, req.userId]
        );
    if (vinculoAluno.length === 0) {
      return res.status(403).json({ erro: 'Aluno não autorizado.' });
    }

    if (req.body?.categoria !== undefined || req.body?.fase !== undefined) {
      const categoria = String(req.body.categoria || '');
      const fase = Number(req.body.fase);
      if (!['Sentimentos', 'Necessidades'].includes(categoria) || !Number.isInteger(fase) || fase < 1 || fase > 5) {
        return res.status(400).json({ erro: 'Categoria ou fase da lição inválida.' });
      }

      const [licoes] = await pool.query(
        'SELECT ATI_ID FROM ATIVIDADE WHERE ATI_TITULO = ? ORDER BY ATI_ID LIMIT 1',
        [`${categoria} - Fase ${fase}`]
      );
      if (licoes.length === 0) {
        return res.status(404).json({ erro: 'A lição selecionada não foi encontrada.' });
      }
      atividadeId = Number(licoes[0].ATI_ID);
    }

    const [atividadeSelecionada] = await pool.query(
      `SELECT a.ATI_TITULO AS titulo, c.CAT_SLUG AS categoria
       FROM ATIVIDADE a
       INNER JOIN SUBCATEGORIA sub ON sub.SUB_ID = a.SUB_ID
       INNER JOIN CATEGORIA c ON c.CAT_ID = sub.CAT_ID
       WHERE a.ATI_ID = ? LIMIT 1`,
      [atividadeId]
    );
    if (
      atividadeSelecionada[0]?.categoria === 'necessidades'
      || atividadeSelecionada[0]?.titulo.startsWith('Necessidades - Fase ')
    ) {
      const acessoNecessidades = await sectionAccessService.obterAcessoNecessidades(alunoId);
      if (!acessoNecessidades.liberada) {
        return res.status(403).json({ erro: 'A seção Necessidades ainda não foi liberada.' });
      }
    }

    const xpGanho = Number.isFinite(pontos) && pontos > 0 ? pontos : (acertos > 0 ? 20 : 0);
    const [atividadeHoje] = await pool.query(
      `SELECT SES_ID FROM SESSAO_ATIVIDADE
       WHERE ALU_ID = ? AND DATE(SES_DTINICIO) = CURDATE()
       LIMIT 1`,
      [alunoId]
    );
    const primeiroAcessoHoje = atividadeHoje.length === 0;

    const [resultado] = await pool.query(
      `INSERT INTO SESSAO_ATIVIDADE
        (ALU_ID, ATI_ID, USU_ID, SES_ACERTOS, SES_TOTALPERGUNTAS, SES_FEEDBACK_RESPONSAVEL, SES_PONTOS, SES_DTINICIO, SES_DTTERMINO)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        alunoId,
        atividadeId,
        usuarioId,
        Math.max(0, acertos),
        Math.max(1, totalPerguntas),
        feedbackResponsavel,
        xpGanho,
      ]
    );

    await pool.query(
      `UPDATE ALUNO
       SET ALU_XP_TOTAL = ALU_XP_TOTAL + ?,
           ALU_DIAS_OFENSIVA = ALU_DIAS_OFENSIVA + ?
       WHERE ALU_ID = ?`,
      [xpGanho, primeiroAcessoHoje ? 1 : 0, alunoId]
    );

    const xpTotal = Number(alunoAtual[0].ALU_XP_TOTAL || 0) + xpGanho;

    return res.json({
      sucesso: true,
      sessaoId: resultado.insertId,
      alunoId,
      xpGanho,
      xpTotal,
      diasOfensiva: Number(alunoAtual[0].ALU_DIAS_OFENSIVA || 0) + (primeiroAcessoHoje ? 1 : 0)
    });
  } catch (error) {
    console.error('Erro ao registrar sessão de atividade:', error);
    return res.status(500).json({ erro: 'Erro ao registrar atividade do aluno.' });
  }
};