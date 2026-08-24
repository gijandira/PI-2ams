const express = require('express');

const router = express.Router();

const verificarToken = require('../middlewares/auth');
const upload = require('../config/multerConfig');

const authController = require('../controllers/authcontroller');

router.post(
  '/cadastro-usuario',
  upload.single('fotoAluno'),
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

router.put(
  '/perfil-usuario',
  verificarToken,
  upload.single('fotoAluno'),
  authController.atualizarPerfilUsuario
);

router.post(
  '/recuperar-senha',
  authController.recuperarSenha
);

router.post(
  '/resetar-senha',
  authController.resetarSenha
);

router.get(
  '/perfil-instituicao',
  verificarToken,
  authController.perfilInstituicao
);

router.put(
  '/perfil-instituicao',
  verificarToken,
  authController.atualizarPerfilInstituicao
);

router.post(
  '/gerar-codigo-instituicao',
  verificarToken,
  authController.gerarCodigoInstituicao
);


module.exports = router;