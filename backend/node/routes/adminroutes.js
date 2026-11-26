const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admincontroller');
const jwt = require('jsonwebtoken');

const verificarAdminMaster = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ erro: 'Token não fornecido.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.cargo !== 'adm_master') {
      return res.status(403).json({ erro: 'Acesso restrito ao Administrador Master.' });
    }
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido.' });
  }
};

router.use(verificarAdminMaster);

router.get('/dados', adminController.obterDadosDashboard);
router.patch('/instituicoes/:id/status', adminController.alterarStatusInstituicao);
router.post('/instituicoes', adminController.criarInstituicao);
router.put('/instituicoes/:id', adminController.atualizarInstituicao);
router.delete('/instituicoes/:id', adminController.excluirInstituicao);

router.post('/alunos', adminController.criarAluno);
router.put('/alunos/:id', adminController.atualizarAluno);
router.delete('/alunos/:id', adminController.excluirAluno);

module.exports = router;