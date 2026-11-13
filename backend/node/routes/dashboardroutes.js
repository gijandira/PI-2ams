const express = require('express');
const verificarToken = require('../middlewares/auth');
const dashboardController = require('../controllers/dashboardcontroller');

const router = express.Router();

router.get('/aluno', verificarToken, dashboardController.obterDashboardAluno);
router.get('/licoes', verificarToken, dashboardController.obterLicoes);
router.post('/licoes/solicitar-liberacao', verificarToken, dashboardController.solicitarLiberacaoProximaSecao);
router.post('/licoes/reiniciar', verificarToken, dashboardController.reiniciarLicoes);
router.post('/registrar-sessao', verificarToken, dashboardController.registrarSessaoAtividade);

module.exports = router;