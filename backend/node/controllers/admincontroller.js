const bcrypt = require('bcryptjs');
const pool = require('../config/db');

exports.garantirSchemaAdmin = async () => {
  const [instituicaoColumns] = await pool.query("SHOW COLUMNS FROM INSTITUICAO LIKE 'INS_STATUS'");
  if (instituicaoColumns.length === 0) {
    await pool.query(
      "ALTER TABLE INSTITUICAO ADD COLUMN INS_STATUS VARCHAR(20) NOT NULL DEFAULT 'aprovado' AFTER INS_COD_ACESSO"
    );
  }

  const [usuarioColumns] = await pool.query("SHOW COLUMNS FROM USUARIO LIKE 'USU_CARGO'");
  const cargoType = usuarioColumns[0]?.Type || '';
  if (/^enum\(/i.test(cargoType) && !cargoType.includes("'adm_master'")) {
    await pool.query(
      "ALTER TABLE USUARIO MODIFY USU_CARGO ENUM('responsavel', 'auxiliar', 'adm_master') NOT NULL"
    );
  }
};

exports.garantirAdminMaster = async () => {
  const emailAdmin = process.env.ADMIN_MASTER_EMAIL?.trim();
  const senhaAdmin = process.env.ADMIN_MASTER_PASSWORD;
  if (!emailAdmin || !senhaAdmin) {
    console.warn('Administrador Master não provisionado: configure ADMIN_MASTER_EMAIL e ADMIN_MASTER_PASSWORD no .env.');
    return;
  }

  if (senhaAdmin.length < 12) {
    throw new Error('ADMIN_MASTER_PASSWORD precisa ter pelo menos 12 caracteres.');
  }

  const [existente] = await pool.query(
    'SELECT USU_ID, USU_CARGO FROM USUARIO WHERE BINARY USU_EMAIL = ?',
    [emailAdmin]
  );
  if (existente.length > 0) {
    if (existente[0].USU_CARGO !== 'adm_master') {
      throw new Error('ADMIN_MASTER_EMAIL já pertence a uma conta que não é Administrador Master.');
    }
    return;
  }

  const hash = await bcrypt.hash(senhaAdmin, 10);
  await pool.query(
    `INSERT INTO USUARIO (USU_NOME, USU_EMAIL, USU_TELEFONE, USU_SENHA, USU_CARGO)
     VALUES ('Administrador Master', ?, NULL, ?, 'adm_master')`,
    [emailAdmin, hash]
  );
  console.log('Administrador Master provisionado a partir das variáveis de ambiente.');
};

// ─── LISTAR TUDO (INSTITUIÇÕES + ALUNOS) ─────────────────────────────────────
exports.obterDadosDashboard = async (req, res) => {
  try {
    const [instituicoes] = await pool.query(
      `SELECT INS_ID AS id, INS_NOME AS nome, INS_TELEFONE AS telefone,
              INS_EMAIL AS email, INS_COD_ACESSO AS codAcesso,
              INS_STATUS AS status, INS_DTCAD AS dataCadastro
       FROM INSTITUICAO
       ORDER BY FIELD(INS_STATUS, 'pendente', 'aprovado', 'recusado'), INS_DTCAD DESC`
    );

    const [alunos] = await pool.query(
      `SELECT a.ALU_ID AS id, a.ALU_NOME AS nome, a.ALU_DTNASC AS dataNascimento,
              a.ALU_DIAGNOSTICO AS diagnostico, a.ALU_XP_TOTAL AS xpTotal,
              a.ALU_DIAS_OFENSIVA AS diasOfensiva, a.INS_ID AS insIdDireto,
              u.USU_ID AS responsavelId, u.USU_NOME AS responsavelNome,
              u.USU_EMAIL AS responsavelEmail, u.USU_TELEFONE AS responsavelTelefone,
              sa.INS_ID AS insIdAfiliacao, sa.SOL_STATUS AS statusAfiliacao,
              i.INS_NOME AS instituicaoNome
       FROM ALUNO a
       LEFT JOIN ALUNO_USUARIO au ON a.ALU_ID = au.ALU_ID
       LEFT JOIN USUARIO u ON au.USU_ID = u.USU_ID
       LEFT JOIN SOLICITACAO_AFILIACAO sa ON a.ALU_ID = sa.ALU_ID AND sa.SOL_STATUS = 'aceito'
       LEFT JOIN INSTITUICAO i ON i.INS_ID = COALESCE(sa.INS_ID, a.INS_ID)
       ORDER BY a.ALU_ID DESC`
    );

    return res.json({ instituicoes, alunos });
  } catch (error) {
    console.error('Erro em obterDadosDashboard:', error);
    return res.status(500).json({ erro: 'Erro ao carregar dados do painel Master.' });
  }
};

// ─── APROVAR OU RECUSAR INSTITUIÇÃO ──────────────────────────────────────────
exports.alterarStatusInstituicao = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['aprovado', 'recusado', 'pendente'].includes(status)) {
      return res.status(400).json({ erro: 'Status inválido.' });
    }

    await pool.query('UPDATE INSTITUICAO SET INS_STATUS = ? WHERE INS_ID = ?', [status, id]);
    return res.json({ mensagem: `Status da instituição atualizado para ${status}.` });
  } catch (error) {
    console.error('Erro em alterarStatusInstituicao:', error);
    return res.status(500).json({ erro: 'Erro ao atualizar status da instituição.' });
  }
};

// ─── CRUD INSTITUIÇÃO: CREATE ────────────────────────────────────────────────
exports.criarInstituicao = async (req, res) => {
  try {
    const { nome, email, telefone, codAcesso, senha, status } = req.body;
    if (!nome || !email || !codAcesso || !senha) {
      return res.status(400).json({ erro: 'Preencha nome, e-mail, código e senha.' });
    }

    const hash = await bcrypt.hash(senha, 10);
    await pool.query(
      `INSERT INTO INSTITUICAO (INS_NOME, INS_EMAIL, INS_TELEFONE, INS_SENHA, INS_COD_ACESSO, INS_STATUS)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, email, telefone || '', hash, codAcesso.toUpperCase(), status || 'aprovado']
    );

    return res.status(201).json({ mensagem: 'Instituição criada com sucesso!' });
  } catch (error) {
    console.error('Erro em criarInstituicao:', error);
    return res.status(500).json({ erro: error.message || 'Erro ao criar instituição.' });
  }
};

// ─── CRUD INSTITUIÇÃO: UPDATE ────────────────────────────────────────────────
exports.atualizarInstituicao = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone, codAcesso, status, novaSenha } = req.body;

    if (novaSenha && novaSenha.trim() !== '') {
      const hash = await bcrypt.hash(novaSenha, 10);
      await pool.query(
        `UPDATE INSTITUICAO SET INS_NOME = ?, INS_EMAIL = ?, INS_TELEFONE = ?, INS_COD_ACESSO = ?, INS_STATUS = ?, INS_SENHA = ?
         WHERE INS_ID = ?`,
        [nome, email, telefone || '', codAcesso, status, hash, id]
      );
    } else {
      await pool.query(
        `UPDATE INSTITUICAO SET INS_NOME = ?, INS_EMAIL = ?, INS_TELEFONE = ?, INS_COD_ACESSO = ?, INS_STATUS = ?
         WHERE INS_ID = ?`,
        [nome, email, telefone || '', codAcesso, status, id]
      );
    }

    return res.json({ mensagem: 'Instituição atualizada com sucesso!' });
  } catch (error) {
    console.error('Erro em atualizarInstituicao:', error);
    return res.status(500).json({ erro: 'Erro ao atualizar instituição.' });
  }
};

// ─── CRUD INSTITUIÇÃO: DELETE ────────────────────────────────────────────────
exports.excluirInstituicao = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM INSTITUICAO WHERE INS_ID = ?', [id]);
    return res.json({ mensagem: 'Instituição excluída com sucesso!' });
  } catch (error) {
    console.error('Erro em excluirInstituicao:', error);
    return res.status(500).json({ erro: 'Erro ao excluir instituição.' });
  }
};

// ─── CRUD ALUNO / RESPONSÁVEL: CREATE ────────────────────────────────────────
exports.criarAluno = async (req, res) => {
  let connection;
  try {
    const { nomeAluno, diagnostico, xpTotal, nomeResponsavel, emailResponsavel, telefoneResponsavel, senhaResponsavel, instituicaoId } = req.body;

    if (!nomeAluno) {
      return res.status(400).json({ erro: 'O nome do aluno é obrigatório.' });
    }
    if ((nomeResponsavel || emailResponsavel) && (!nomeResponsavel || !emailResponsavel || !senhaResponsavel)) {
      return res.status(400).json({ erro: 'Informe nome, e-mail e senha do responsável.' });
    }
    if (senhaResponsavel && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/.test(senhaResponsavel)) {
      return res.status(400).json({ erro: 'A senha do responsável deve ter 8 caracteres ou mais, com maiúscula, minúscula, número e símbolo.' });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    let usuarioId = null;
    if (emailResponsavel && nomeResponsavel) {
      const hash = await bcrypt.hash(senhaResponsavel, 10);
      const [resUsu] = await connection.query(
        `INSERT INTO USUARIO (USU_NOME, USU_EMAIL, USU_TELEFONE, USU_SENHA, USU_CARGO)
         VALUES (?, ?, ?, ?, 'responsavel')`,
        [nomeResponsavel, emailResponsavel, telefoneResponsavel || null, hash]
      );
      usuarioId = resUsu.insertId;
    }

    const [resAlu] = await connection.query(
      `INSERT INTO ALUNO (ALU_NOME, ALU_DIAGNOSTICO, ALU_XP_TOTAL, USU_ID, INS_ID)
       VALUES (?, ?, ?, ?, ?)`,
      [nomeAluno, diagnostico || null, Number(xpTotal) || 0, usuarioId, instituicaoId || null]
    );
    const alunoId = resAlu.insertId;

    if (usuarioId) {
      await connection.query('INSERT INTO ALUNO_USUARIO (ALU_ID, USU_ID) VALUES (?, ?)', [alunoId, usuarioId]);
    }
    await connection.query('INSERT INTO PERFIL (ALU_ID) VALUES (?)', [alunoId]);

    if (instituicaoId) {
      await connection.query(
        `INSERT INTO SOLICITACAO_AFILIACAO (ALU_ID, INS_ID, SOL_STATUS, SOL_DT_RESPOSTA)
         VALUES (?, ?, 'aceito', NOW())`,
        [alunoId, instituicaoId]
      );
    }

    await connection.commit();
    return res.status(201).json({ mensagem: 'Aluno cadastrado com sucesso!' });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Erro em criarAluno:', error);
    return res.status(500).json({ erro: error.message || 'Erro ao criar aluno.' });
  } finally {
    if (connection) connection.release();
  }
};

// ─── CRUD ALUNO / RESPONSÁVEL: UPDATE ────────────────────────────────────────
exports.atualizarAluno = async (req, res) => {
  try {
    const { id } = req.params;
    const { nomeAluno, diagnostico, xpTotal, responsavelId, nomeResponsavel, emailResponsavel, telefoneResponsavel, instituicaoId } = req.body;

    await pool.query(
      `UPDATE ALUNO SET ALU_NOME = ?, ALU_DIAGNOSTICO = ?, ALU_XP_TOTAL = ?, INS_ID = ? WHERE ALU_ID = ?`,
      [nomeAluno, diagnostico || null, Number(xpTotal) || 0, instituicaoId || null, id]
    );

    if (responsavelId && nomeResponsavel && emailResponsavel) {
      await pool.query(
        `UPDATE USUARIO SET USU_NOME = ?, USU_EMAIL = ?, USU_TELEFONE = ? WHERE USU_ID = ?`,
        [nomeResponsavel, emailResponsavel, telefoneResponsavel || null, responsavelId]
      );
    }

    await pool.query('DELETE FROM SOLICITACAO_AFILIACAO WHERE ALU_ID = ?', [id]);
    if (instituicaoId) {
      await pool.query(
        `INSERT INTO SOLICITACAO_AFILIACAO (ALU_ID, INS_ID, SOL_STATUS, SOL_DT_RESPOSTA)
         VALUES (?, ?, 'aceito', NOW())`,
        [id, instituicaoId]
      );
    }

    return res.json({ mensagem: 'Dados do aluno atualizados com sucesso!' });
  } catch (error) {
    console.error('Erro em atualizarAluno:', error);
    return res.status(500).json({ erro: 'Erro ao atualizar aluno.' });
  }
};

// ─── CRUD ALUNO: DELETE ──────────────────────────────────────────────────────
exports.excluirAluno = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM ALUNO WHERE ALU_ID = ?', [id]);
    return res.json({ mensagem: 'Aluno excluído com sucesso!' });
  } catch (error) {
    console.error('Erro em excluirAluno:', error);
    return res.status(500).json({ erro: 'Erro ao excluir aluno.' });
  }
};