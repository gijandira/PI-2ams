const express = require('express');
const { responderDuvida } = require('../services/iaService');

const router = express.Router();

const CONTEXTO_SITE = `
--- GUIA GERAL DE NAVEGAÇÃO DO AUTIM ---

VISÃO GERAL DO SITE (COMO O SISTEMA É ORGANIZADO):
O AUTIM é composto por 6 módulos principais:
1. 🏠 Início (Home): Painel principal com resumo de XP acumulado, dias seguidos (ofensiva), nível e atalhos para todos os módulos.
2. 💬 Comunicação: Prancha com cartões ilustrados (PECS) divididos em categorias (Sentimentos, Necessidades, Ações, Lugares, Pessoas). Ao tocar em um cartão, o sistema fala a palavra em voz alta.
3. 📅 Agenda: Calendário semanal para organizar a rotina da criança (Lições, Terapias, Saúde, Esporte, Lazer). É possível criar novos eventos no botão "+".
4. 👤 Perfil: Mostra os dados do aluno, progresso e o botão "✏️ Editar perfil" para mudar foto e informações.
5. ⚙️ Configurações: Onde você ativa/desativa o narrador, escolhe a voz (Feminina, Masculina), velocidade e ativa o Modo Escuro.
6. 🤖 Assistente IA (Timi): Espaço de conversa para tirar dúvidas do site, rotina e autismo.

COMO NAVEGAR NO CELULAR VS COMPUTADOR:
- No celular: Use a barra de navegação no rodapé da tela (ícones: Início, Comunicar, Lições, Agenda, Perfil).
- No computador: Use o menu lateral esquerdo fixo com acesso a todas as páginas e botão de sair.

PASSO A PASSO PARA CADA DÚVIDA DE NAVEGAÇÃO:

1. Como ir para Configurações e mudar a voz:
   - No celular: Toque no card "Configurações" (⚙️) na tela Início, ou vá em "Perfil" > "Configurações".
   - No computador: Clique em "Configurações" (⚙️) no menu lateral esquerdo.
   - Na página: Vá na seção "Voz do Narrador", selecione "Feminina" ou "Masculina", ajuste a velocidade e clique em "▶ Testar voz".

2. Como usar a Comunicação (cartões PECS):
   - Acesse "Comunicar" na barra de navegação ou clique no card "Comunicação".
   - Escolha a categoria desejada no topo (Sentimentos, Necessidades, Ações, Lugares, Pessoas).
   - Toque em qualquer cartão para ouvir a voz falar a palavra.

3. Como criar um compromisso ou evento na Agenda:
   - Acesse a aba "Agenda".
   - Clique no botão "+" (no celular) ou "＋ Novo evento" (no computador).
   - Preencha o Título, Data, Horário e selecione o Tipo (Lição, Terapia, Saúde, Esporte ou Lazer).
   - Clique em "Salvar Evento".

4. Como editar o perfil e trocar a foto do aluno:
   - Vá na aba "Perfil".
   - Clique no botão "✏️ Editar perfil".
   - Toque no avatar circular para escolher uma imagem do seu aparelho e salve.

5. Como sair da conta (Logout):
   - Vá em "Perfil" e clique em "Sair da conta" (🚪) ou clique em "🚪 Sair" no menu lateral.

--- BASE DE CONHECIMENTO SOBRE AUTISMO (TEA) ---

O QUE É O TEA:
- Transtorno do neurodesenvolvimento com 3 níveis de suporte (1: leve, 2: moderado, 3: severo). Não é doença e não tem cura.

MANEJO DE CRISES (MELTDOWN):
1. Garanta a segurança física imediata e afaste objetos cortantes ou pontiagudos.
2. Diminua luzes, desligue aparelhos barulhentos e afaste curiosos.
3. Não brigue, não grite e não faça contenção à força.
4. Fale baixo e calmo ou permaneça em silêncio por perto.
5. Quando passar, ofereça água fresca e repouso sem fazer cobranças.

DIFERENÇA DE BIRRA E MELTDOWN:
- Birra tem objetivo (a criança quer algo e para quando consegue).
- Meltdown é uma descarga neurológica involuntária por sobrecarga e precisa de tempo para acalmar.

SHUTDOWN (DESLIGAMENTO):
- A criança fica quieta, sem falar ou apática. Respeite o espaço, fique por perto e use cartões visuais.

SELETIVIDADE ALIMENTAR:
- Causa sensorial (texturas/cheiros). Nunca force. Introduza novos alimentos aos poucos mantendo um alimento seguro.

DIREITOS NO BRASIL:
- Lei Berenice Piana (12.764/12): Garante direitos de PCD.
- CIPTEA (13.977/20): Carteira de prioridade.
- Planos de Saúde (RN 539 ANS): Terapias ilimitadas (ABA, Fono, TO).
- Escola: Matrícula obrigatória e direito a mediador/apoio escolar.
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
