//Importando
const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

//Definir
process.env.JWT_SECRET = 'chave_teste_devsecops';

const verificarToken = require('../middlewares/auth');

//Simular resposta
function criarResposta() {
  return {
    statusCode: null,
    dados: null,

    status(codigo) {
      this.statusCode = codigo;
      return this;
    },

    json(dados) {
      this.dados = dados;
      return this;
    }
  };
}

// TESTE 1: Bloquear acesso sem token
test('DevSecOps - Deve bloquear acesso sem token', () => {
  const req = { headers: {} };
  const res = criarResposta();
  let nextChamado = false;

  verificarToken(req, res, () => {
    nextChamado = true;
  });

  assert.equal(res.statusCode, 401);
  assert.equal(nextChamado, false);
});

// TESTE 2: Bloquear token inválido
test('DevSecOps - Deve bloquear token inválido', () => {
  const req = {
    headers: {
      authorization: 'Bearer token_invalido'
    }
  };

  const res = criarResposta();
  let nextChamado = false;

  verificarToken(req, res, () => {
    nextChamado = true;
  });

  assert.equal(res.statusCode, 401);
  assert.equal(nextChamado, false);
});

// TESTE 3: Permitir token válido
test('DevSecOps - Deve permitir acesso com token válido', () => {
  const token = jwt.sign(
    { id: 1, tipo: 'usuario', cargo: 'responsavel' },
    process.env.JWT_SECRET,
    { expiresIn: '5m' }
  );

  const req = {
    headers: {
      authorization: `Bearer ${token}`
    }
  };

  const res = criarResposta();
  let nextChamado = false;

  verificarToken(req, res, () => {
    nextChamado = true;
  });

  assert.equal(nextChamado, true);
  assert.equal(req.userId, 1);
  assert.equal(req.userCargo, 'responsavel');
});

// node --test node/tests/devsecops-auth.test.js