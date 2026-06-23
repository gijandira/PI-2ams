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
  async (req, res) => {

    try {

      const pool = require('../config/db');

      const [instituicoes] = await pool.query(
        'SELECT * FROM INSTITUICAO WHERE INS_ID = ?',
        [req.userId]
      );

      if (instituicoes.length === 0) {
        return res.status(404).json({
          erro: 'Instituição não encontrada'
        });
      }

      res.json({
        instituicao: instituicoes[0]
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        erro: 'Erro interno do servidor'
      });

    }

  }
);


module.exports = router;