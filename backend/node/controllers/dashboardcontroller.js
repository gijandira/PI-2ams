const pool = require('../config/db');

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
      `SELECT c.CAT_ID AS id, c.CAT_NOME AS nome, c.CAT_ICONE AS icone,
              COUNT(DISTINCT a.ATI_ID) AS total,
              COUNT(DISTINCT CASE WHEN s.SES_ID IS NOT NULL THEN a.ATI_ID END) AS concluidas
       FROM CATEGORIA c
       LEFT JOIN SUBCATEGORIA sub ON sub.CAT_ID = c.CAT_ID
       LEFT JOIN ATIVIDADE a ON a.SUB_ID = sub.SUB_ID
       LEFT JOIN SESSAO_ATIVIDADE s ON s.ATI_ID = a.ATI_ID AND s.ALU_ID = ? ${intervalo.inicio ? 'AND s.SES_DTINICIO >= ?' : ''}
       GROUP BY c.CAT_ID, c.CAT_NOME, c.CAT_ICONE ORDER BY c.CAT_ID`,
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