const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// ─── CADASTRO DE USUÁRIO (Responsável) ───────────────────────────────────────
exports.cadastroUsuario = async (req, res) => {
  try {
    const { nomeAluno, nomeResponsavel, telefone, email, senha } = req.body;
    const senhaForte =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;

if (!senhaForte.test(senha)) {
  return res.status(400).json({
    erro:
      'A senha deve ter pelo menos 8 caracteres, letra maiúscula, minúscula, número e símbolo.'
  });
}

    if (!nomeResponsavel || !email || !senha) {
      return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });
    }

    // Verificar se email já existe
    const [existente] = await pool.query(
      'SELECT USU_ID FROM USUARIO WHERE USU_EMAIL = ?',
      [email]
    );
    if (existente.length > 0) {
      return res.status(409).json({ erro: 'E-mail já cadastrado.' });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    // Criar usuário (responsável)
    const [resultUsuario] = await pool.query(
      `INSERT INTO USUARIO (USU_NOME, USU_EMAIL, USU_TELEFONE, USU_SENHA, USU_CARGO)
       VALUES (?, ?, ?, ?, 'responsavel')`,
      [nomeResponsavel, email, telefone || null, senhaCriptografada]
    );
    const usuarioId = resultUsuario.insertId;

    // Criar aluno vinculado
    let alunoId = null;
    if (nomeAluno) {
      const [resultAluno] = await pool.query(
        `INSERT INTO ALUNO (ALU_NOME) VALUES (?)`,
        [nomeAluno]
      );
      alunoId = resultAluno.insertId;

      // Vincular aluno ao usuário
      await pool.query(
        `INSERT INTO ALUNO_USUARIO (ALU_ID, USU_ID) VALUES (?, ?)`,
        [alunoId, usuarioId]
      );

      // Criar perfil do aluno
      await pool.query(
        `INSERT INTO PERFIL (ALU_ID) VALUES (?)`,
        [alunoId]
      );
    }

    const token = jwt.sign(
      { id: usuarioId, cargo: 'responsavel' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
  mensagem: 'Cadastro realizado com sucesso!'
});

  } catch (error) {

  console.error('Erro em perfilUsuario:', error);

  return res.status(500).json({
    erro: error.message,
    stack: error.stack
  });

}
};

// ─── CADASTRO DE INSTITUIÇÃO ──────────────────────────────────────────────────
exports.cadastroInstituicao = async (req, res) => {
  try {
    const { nome, telefone, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });
    }

    const [existente] = await pool.query(
      'SELECT INS_ID FROM INSTITUICAO WHERE INS_EMAIL = ?',
      [email]
    );
    if (existente.length > 0) {
      return res.status(409).json({ erro: 'E-mail já cadastrado.' });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    // Gerar código de acesso único
    const codAcesso = 'INS-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    const [result] = await pool.query(
      `INSERT INTO INSTITUICAO (INS_NOME, INS_TELEFONE, INS_EMAIL, INS_SENHA, INS_COD_ACESSO)
       VALUES (?, ?, ?, ?, ?)`,
      [nome, telefone || '', email, senhaCriptografada, codAcesso]
    );

    const token = jwt.sign(
      { id: result.insertId, tipo: 'instituicao' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
  mensagem: 'Instituição cadastrada com sucesso!'
});

  } catch (error) {
    console.error('Erro em cadastroInstituicao:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// ─── LOGIN DE USUÁRIO ─────────────────────────────────────────────────────────
exports.loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Informe e-mail e senha.' });
    }

    const [usuarios] = await pool.query(
      'SELECT * FROM USUARIO WHERE USU_EMAIL = ?',
      [email]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
    }

    const usuario = usuarios[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.USU_SENHA);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
    }

    const token = jwt.sign(
      { id: usuario.USU_ID, cargo: usuario.USU_CARGO },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      usuario: {
        id: usuario.USU_ID,
        nome: usuario.USU_NOME,
        email: usuario.USU_EMAIL,
        cargo: usuario.USU_CARGO
      }
    });

  } catch (error) {
    console.error('Erro em loginUsuario:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// ─── LOGIN DE INSTITUIÇÃO ─────────────────────────────────────────────────────
exports.loginInstituicao = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Informe e-mail e senha.' });
    }

    const [instituicoes] = await pool.query(
      'SELECT * FROM INSTITUICAO WHERE INS_EMAIL = ?',
      [email]
    );

    if (instituicoes.length === 0) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
    }

    const inst = instituicoes[0];
    const senhaCorreta = await bcrypt.compare(senha, inst.INS_SENHA);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
    }

    const token = jwt.sign(
      { id: inst.INS_ID, tipo: 'instituicao' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      instituicao: {
        id: inst.INS_ID,
        nome: inst.INS_NOME,
        email: inst.INS_EMAIL,
        codAcesso: inst.INS_COD_ACESSO
      }
    });

  } catch (error) {
    console.error('Erro em loginInstituicao:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// ─── PERFIL DO USUÁRIO ────────────────────────────────────────────────────────
exports.perfilUsuario = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ erro: 'Token não enviado.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [usuarios] = await pool.query(
      'SELECT USU_ID, USU_NOME, USU_EMAIL, USU_CARGO, USU_DTCAD FROM USUARIO WHERE USU_ID = ?',
      [decoded.id]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    const usuario = usuarios[0];

    const [alunos] = await pool.query(
      `SELECT a.* FROM ALUNO a
       INNER JOIN ALUNO_USUARIO au ON a.ALU_ID = au.ALU_ID
       WHERE au.USU_ID = ? LIMIT 1`,
      [decoded.id]
    );

    const [perfis] = await pool.query(
      `SELECT p.* FROM PERFIL p
       INNER JOIN ALUNO_USUARIO au ON p.ALU_ID = au.ALU_ID
       WHERE au.USU_ID = ? LIMIT 1`,
      [decoded.id]
    );

    return res.json({
      usuario,
      aluno: alunos[0] || null,
      perfil: perfis[0] || null
    });

  } catch (error) {
    console.error('Erro em perfilUsuario:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};