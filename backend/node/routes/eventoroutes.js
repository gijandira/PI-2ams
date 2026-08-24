const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth');
const eventoController = require('../controllers/eventocontroller');

// Criar novo evento
router.post('/criar', verificarToken, eventoController.criarEvento);

// Listar eventos de um aluno
router.get('/listar', verificarToken, eventoController.listarEventos);

// Atualizar evento
router.put('/atualizar/:eventoId', verificarToken, eventoController.atualizarEvento);

// Deletar evento
router.delete('/deletar/:eventoId', verificarToken, eventoController.deletarEvento);

module.exports = router;
