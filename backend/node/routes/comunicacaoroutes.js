const express = require('express');
const router = express.Router();
const comunicacaoController = require('../controllers/comunicacaocontroller');

router.get('/categorias', comunicacaoController.getCategorias);
router.get('/cards', comunicacaoController.getCards);

module.exports = router;
