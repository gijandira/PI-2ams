const express = require('express');
const verificarToken = require('../middlewares/auth');
const afiliacaoController = require('../controllers/afiliacaocontroller');

const router = express.Router();

router.get('/', verificarToken, afiliacaoController.listarAfiliacoes);
router.post('/', verificarToken, afiliacaoController.solicitarAfiliacao);
router.delete('/:solicitacaoId', verificarToken, afiliacaoController.removerAfiliacao);
router.get('/instituicao', verificarToken, afiliacaoController.listarSolicitacoesInstituicao);
router.get('/instituicao/alunos', verificarToken, afiliacaoController.listarAlunosInstituicao);
router.delete('/instituicao/:solicitacaoId', verificarToken, afiliacaoController.removerAlunoInstituicao);
router.get('/instituicao/relatorio', verificarToken, afiliacaoController.obterRelatorioInstituicao);
router.patch('/instituicao/:solicitacaoId', verificarToken, afiliacaoController.responderSolicitacao);

module.exports = router;