const express = require('express');

const router = express.Router();

const authController = require('../controllers/authcontroller');

router.post(
  '/cadastro-usuario',
  authController.cadastroUsuario
);

router.post(
  '/cadastro-instituicao',
  authController.cadastroInstituicao
);

router.post(
  '/login-usuario',
  authController.loginUsuario
);

router.post(
  '/login-instituicao',
  authController.loginInstituicao
);

router.get(
  '/perfil-usuario',
  authController.perfilUsuario
);

module.exports = router;