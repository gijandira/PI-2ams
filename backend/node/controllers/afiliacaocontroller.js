const pool = require('../config/db');

const buscarAlunoDoUsuario = async (usuarioId) => {
  const [alunos] = await pool.query(
    `SELECT ALU_ID FROM ALUNO_USUARIO WHERE USU_ID = ? LIMIT 1`,
    [usuarioId]
  );
  return alunos[0]?.ALU_ID || null;
};

const garantirResponsavel = (req, res) => {
  if (req.userTipo === 'instituicao') {
    res.status(403).json({ erro: 'Apenas responsáveis podem realizar esta ação.' });
    return false;
  }
  return true;
};

exports.listarAfiliacoes = async (req, res) => {
  try {
    if (!garantirResponsavel(req, res)) return;
    const alunoId = await buscarAlunoDoUsuario(req.userId);

    if (!alunoId) return res.status(404).json({ erro: 'Aluno não encontrado.' });

    const [solicitacoes] = await pool.query(
      `SELECT s.SOL_ID AS id, s.SOL_STATUS AS status,
              s.SOL_DT_SOLICITACAO AS dataSolicitacao,
              s.SOL_DT_RESPOSTA AS dataResposta,
              i.INS_ID AS instituicaoId, i.INS_NOME AS instituicaoNome
       FROM SOLICITACAO_AFILIACAO s
       INNER JOIN INSTITUICAO i ON i.INS_ID = s.INS_ID
       WHERE s.ALU_ID = ?
       ORDER BY s.SOL_DT_SOLICITACAO DESC`,
      [alunoId]
    );

    res.json({ alunoId, solicitacoes });
  } catch (error) {
    console.error('Erro ao listar afiliações:', error);
    res.status(500).json({ erro: 'Erro ao carregar afiliações.' });
  }
};

exports.solicitarAfiliacao = async (req, res) => {
  try {
    if (!garantirResponsavel(req, res)) return;
    const codigo = String(req.body.codigo || '').trim();
    const alunoId = await buscarAlunoDoUsuario(req.userId);

    if (!alunoId) return res.status(404).json({ erro: 'Aluno não encontrado.' });
    if (!codigo) return res.status(400).json({ erro: 'Informe o código da instituição.' });

    const [instituicoes] = await pool.query(
      `SELECT INS_ID, INS_NOME FROM INSTITUICAO WHERE BINARY INS_COD_ACESSO = ? LIMIT 1`,
      [codigo]
    );
    if (instituicoes.length === 0) {
      return res.status(404).json({ erro: 'Código de instituição inválido.' });
    }

    const instituicao = instituicoes[0];
    const [existentes] = await pool.query(
      `SELECT SOL_ID, SOL_STATUS FROM SOLICITACAO_AFILIACAO
       WHERE ALU_ID = ? AND INS_ID = ? AND SOL_STATUS IN ('pendente', 'aceito')
       LIMIT 1`,
      [alunoId, instituicao.INS_ID]
    );
    if (existentes[0]?.SOL_STATUS === 'aceito') {
      return res.status(409).json({ erro: 'O aluno já está vinculado a esta instituição.' });
    }
    if (existentes[0]) {
      return res.status(409).json({ erro: 'Já existe uma solicitação pendente para esta instituição.' });
    }

    const [resultado] = await pool.query(
      `INSERT INTO SOLICITACAO_AFILIACAO (ALU_ID, INS_ID) VALUES (?, ?)`,
      [alunoId, instituicao.INS_ID]
    );

    res.status(201).json({
      sucesso: true,
      solicitacao: {
        id: resultado.insertId,
        status: 'pendente',
        instituicaoId: instituicao.INS_ID,
        instituicaoNome: instituicao.INS_NOME
      }
    });
  } catch (error) {
    console.error('Erro ao solicitar afiliação:', error);
    res.status(500).json({ erro: 'Erro ao solicitar afiliação.' });
  }
};

exports.removerAfiliacao = async (req, res) => {
  try {
    if (!garantirResponsavel(req, res)) return;
    const alunoId = await buscarAlunoDoUsuario(req.userId);
    const { solicitacaoId } = req.params;

    const [resultado] = await pool.query(
      `DELETE FROM SOLICITACAO_AFILIACAO
       WHERE SOL_ID = ? AND ALU_ID = ? AND SOL_STATUS IN ('pendente', 'aceito')`,
      [solicitacaoId, alunoId]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Afiliação não encontrada.' });
    }
    res.json({ sucesso: true });
  } catch (error) {
    console.error('Erro ao remover afiliação:', error);
    res.status(500).json({ erro: 'Erro ao remover afiliação.' });
  }
};

exports.listarSolicitacoesInstituicao = async (req, res) => {
  try {
    if (req.userTipo !== 'instituicao') {
      return res.status(403).json({ erro: 'Apenas instituições podem acessar esta área.' });
    }
    const [solicitacoes] = await pool.query(
      `SELECT s.SOL_ID AS id, s.SOL_STATUS AS status,
              s.SOL_DT_SOLICITACAO AS dataSolicitacao,
              a.ALU_ID AS alunoId, a.ALU_NOME AS alunoNome,
              u.USU_NOME AS responsavelNome, u.USU_TELEFONE AS responsavelTelefone,
              u.USU_EMAIL AS responsavelEmail
       FROM SOLICITACAO_AFILIACAO s
       INNER JOIN ALUNO a ON a.ALU_ID = s.ALU_ID
       INNER JOIN ALUNO_USUARIO au ON au.ALU_ID = a.ALU_ID
       INNER JOIN USUARIO u ON u.USU_ID = au.USU_ID
       WHERE s.INS_ID = ?
       ORDER BY s.SOL_DT_SOLICITACAO DESC`,
      [req.userId]
    );
    res.json({ solicitacoes });
  } catch (error) {
    console.error('Erro ao listar solicitações:', error);
    res.status(500).json({ erro: 'Erro ao carregar solicitações.' });
  }
};

exports.listarAlunosInstituicao = async (req, res) => {
  try {
    if (req.userTipo !== 'instituicao') {
      return res.status(403).json({ erro: 'Apenas instituições podem acessar esta área.' });
    }
    const [alunos] = await pool.query(
      `SELECT s.SOL_ID AS solicitacaoId, a.ALU_ID AS id, a.ALU_NOME AS nome, a.ALU_URLAVATAR AS avatar,
              u.USU_NOME AS responsavelNome,
              COALESCE(ROUND(100 * SUM(sa.SES_ACERTOS) / NULLIF(SUM(sa.SES_TOTALPERGUNTAS), 0)), 0) AS progresso,
              CASE WHEN MAX(sa.SES_DTINICIO) >= CURDATE() THEN 1 ELSE 0 END AS online
       FROM SOLICITACAO_AFILIACAO s
       INNER JOIN ALUNO a ON a.ALU_ID = s.ALU_ID
       LEFT JOIN ALUNO_USUARIO au ON au.ALU_ID = a.ALU_ID
       LEFT JOIN USUARIO u ON u.USU_ID = au.USU_ID
       LEFT JOIN SESSAO_ATIVIDADE sa ON sa.ALU_ID = a.ALU_ID
       WHERE s.INS_ID = ? AND s.SOL_STATUS = 'aceito'
       GROUP BY a.ALU_ID, a.ALU_NOME, a.ALU_URLAVATAR, u.USU_NOME
       ORDER BY a.ALU_NOME`,
      [req.userId]
    );
    res.json({ alunos: alunos.map(aluno => ({ ...aluno, solicitacaoId: Number(aluno.solicitacaoId), progresso: Number(aluno.progresso), online: Boolean(aluno.online) })) });
  } catch (error) {
    console.error('Erro ao listar alunos da instituição:', error);
    res.status(500).json({ erro: 'Erro ao carregar alunos da instituição.' });
  }
};

exports.removerAlunoInstituicao = async (req, res) => {
  try {
    if (req.userTipo !== 'instituicao') {
      return res.status(403).json({ erro: 'Apenas instituições podem remover alunos.' });
    }
    const [resultado] = await pool.query(
      `DELETE FROM SOLICITACAO_AFILIACAO
       WHERE SOL_ID = ? AND INS_ID = ? AND SOL_STATUS = 'aceito'`,
      [req.params.solicitacaoId, req.userId]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Aluno afiliado não encontrado.' });
    }
    res.json({ sucesso: true, mensagem: 'Aluno removido da instituição.' });
  } catch (error) {
    console.error('Erro ao remover aluno da instituição:', error);
    res.status(500).json({ erro: 'Erro ao remover aluno da instituição.' });
  }
};

exports.obterRelatorioInstituicao = async (req, res) => {
  try {
    if (req.userTipo !== 'instituicao') {
      return res.status(403).json({ erro: 'Apenas instituições podem acessar esta área.' });
    }
    const [resumo] = await pool.query(
      `SELECT COUNT(sa.SES_ID) AS licoes,
              COALESCE(SUM(sa.SES_ACERTOS), 0) AS acertos,
              COALESCE(SUM(sa.SES_TOTALPERGUNTAS), 0) AS perguntas,
              COUNT(DISTINCT DATE(sa.SES_DTINICIO)) AS diasAtivos
       FROM SOLICITACAO_AFILIACAO s
       INNER JOIN SESSAO_ATIVIDADE sa ON sa.ALU_ID = s.ALU_ID
       WHERE s.INS_ID = ? AND s.SOL_STATUS = 'aceito'
         AND sa.SES_DTINICIO >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`,
      [req.userId]
    );
    const [xp] = await pool.query(
      `SELECT COALESCE(SUM(a.ALU_XP_TOTAL), 0) AS xp
       FROM ALUNO a
       INNER JOIN SOLICITACAO_AFILIACAO s ON s.ALU_ID = a.ALU_ID
       WHERE s.INS_ID = ? AND s.SOL_STATUS = 'aceito'`,
      [req.userId]
    );
    const [ranking] = await pool.query(
      `SELECT a.ALU_NOME AS nome, COALESCE(SUM(sa.SES_PONTOS), 0) AS pontuacao
       FROM SOLICITACAO_AFILIACAO s
       INNER JOIN ALUNO a ON a.ALU_ID = s.ALU_ID
       LEFT JOIN SESSAO_ATIVIDADE sa ON sa.ALU_ID = a.ALU_ID
         AND sa.SES_DTINICIO >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       WHERE s.INS_ID = ? AND s.SOL_STATUS = 'aceito'
       GROUP BY a.ALU_ID, a.ALU_NOME
       ORDER BY pontuacao DESC, a.ALU_NOME
       LIMIT 3`,
      [req.userId]
    );
    const stats = resumo[0];
    const perguntas = Number(stats.perguntas);
    res.json({
      periodo: 'Últimos 30 dias',
      resumo: {
        taxaAcerto: perguntas ? Math.round((Number(stats.acertos) / perguntas) * 100) : 0,
        licoes: Number(stats.licoes),
        mediaDiasSemana: Number((Number(stats.diasAtivos) / 4.29).toFixed(1)),
        xpColetivo: Number(xp[0].xp)
      },
      ranking: ranking.map((aluno, index) => ({
        nome: aluno.nome,
        pontuacao: Number(aluno.pontuacao),
        medalha: ['🥇', '🥈', '🥉'][index]
      }))
    });
  } catch (error) {
    console.error('Erro ao gerar relatório da instituição:', error);
    res.status(500).json({ erro: 'Erro ao carregar relatório da instituição.' });
  }
};

exports.responderSolicitacao = async (req, res) => {
  try {
    if (req.userTipo !== 'instituicao') {
      return res.status(403).json({ erro: 'Apenas instituições podem responder solicitações.' });
    }
    const status = req.body.status;
    if (!['aceito', 'recusado'].includes(status)) {
      return res.status(400).json({ erro: 'Status de resposta inválido.' });
    }

    const [resultado] = await pool.query(
      `UPDATE SOLICITACAO_AFILIACAO
       SET SOL_STATUS = ?, SOL_DT_RESPOSTA = NOW()
       WHERE SOL_ID = ? AND INS_ID = ? AND SOL_STATUS = 'pendente'`,
      [status, req.params.solicitacaoId, req.userId]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Solicitação pendente não encontrada.' });
    }
    res.json({ sucesso: true, status });
  } catch (error) {
    console.error('Erro ao responder solicitação:', error);
    res.status(500).json({ erro: 'Erro ao responder solicitação.' });
  }
};