const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventocontroller');

// Criar novo evento
router.post('/criar', eventoController.criarEvento);

// Listar eventos de um aluno
router.get('/listar', eventoController.listarEventos);

// Atualizar evento
router.put('/atualizar/:eventoId', eventoController.atualizarEvento);

// Deletar evento
router.delete('/deletar/:eventoId', eventoController.deletarEvento);

module.exports = router;
