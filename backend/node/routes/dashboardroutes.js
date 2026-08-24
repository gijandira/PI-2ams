const express = require('express');
const verificarToken = require('../middlewares/auth');
const dashboardController = require('../controllers/dashboardcontroller');

const router = express.Router();

router.get('/aluno', verificarToken, dashboardController.obterDashboardAluno);

module.exports = router;