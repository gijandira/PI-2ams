const express = require('express');
const { responderDuvida } = require('../services/iaService');

const router = express.Router();

const CONTEXTO_SITE = `
- O site AUTIM possui as páginas: Comunicação, Agenda, Lições e Perfil.
- Na página de Comunicação, cada card PECS pode ser tocado para ouvir a palavra associada.
- Para acessar o sistema, o usuário precisa realizar cadastro e login com e-mail e senha válidos.
- O projeto tem foco em apoio a pessoas com autismo e comunicação.
`;

router.post('/perguntar', async (req, res) => {
  try {
    const { mensagem } = req.body;

    if (!mensagem || typeof mensagem !== 'string' || !mensagem.trim()) {
      return res.status(400).json({ erro: 'A mensagem é obrigatória.' });
    }

    const respostaIA = await responderDuvida(mensagem, CONTEXTO_SITE);

    return res.json({ resposta: respostaIA });
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
});

module.exports = router;
