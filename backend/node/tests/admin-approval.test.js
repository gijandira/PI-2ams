const test = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const authController = require('../controllers/authcontroller');

const criarResponse = () => ({
  statusCode: 200,
  body: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  }
});

test('cadastro institucional cria solicitação pendente sem autenticar a instituição', async t => {
  const originalQuery = pool.query;
  const queries = [];
  pool.query = async (sql, params) => {
    queries.push({ sql, params });
    if (sql.startsWith('SELECT INS_ID')) return [[], []];
    if (sql.includes('INSERT INTO INSTITUICAO')) return [{ insertId: 12 }, []];
    throw new Error(`Consulta inesperada: ${sql}`);
  };
  t.after(() => {
    pool.query = originalQuery;
  });

  const response = criarResponse();
  await authController.cadastroInstituicao({
    body: {
      nome: 'Instituição de teste',
      telefone: '12345678901',
      email: 'teste@instituicao.com',
      senha: 'SenhaForte1!',
      codigo: 'teste-123'
    }
  }, response);

  assert.equal(response.statusCode, 201);
  assert.match(response.body.mensagem, /aguarde a aprovação/i);
  const insert = queries.find(({ sql }) => sql.includes('INSERT INTO INSTITUICAO'));
  assert.match(insert.sql, /INS_STATUS/);
  assert.match(insert.sql, /'pendente'/);
});

test('instituição pendente não recebe sessão de login', async t => {
  const originalQuery = pool.query;
  const senha = await bcrypt.hash('SenhaForte1!', 4);
  pool.query = async () => [[{
    INS_ID: 12,
    INS_EMAIL: 'teste@instituicao.com',
    INS_SENHA: senha,
    INS_STATUS: 'pendente'
  }], []];
  t.after(() => {
    pool.query = originalQuery;
  });

  const response = criarResponse();
  await authController.loginInstituicao({
    body: { email: 'teste@instituicao.com', senha: 'SenhaForte1!' }
  }, response);

  assert.equal(response.statusCode, 403);
  assert.match(response.body.erro, /aguardando aprovação/i);
  assert.equal(response.body.token, undefined);
});
