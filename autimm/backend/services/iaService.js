const ollamaModule = require('ollama');
const ollama = ollamaModule.default || ollamaModule;

/**
 * Envia uma pergunta para o Ollama utilizando o modelo qwen2.5:0.5b.
 * @param {string} mensagemUsuario - A dúvida enviada pelo usuário.
 * @param {string} contextoSite - Informações sobre o site ou Autismo.
 * @returns {Promise<string>} - Resposta gerada pelo modelo.
 */
async function responderDuvida(mensagemUsuario, contextoSite = '') {
  try {
    if (!mensagemUsuario || typeof mensagemUsuario !== 'string') {
      throw new Error('Mensagem do usuário inválida.');
    }

    const response = await ollama.chat({
      model: 'qwen2.5:0.5b',
      messages: [
        {
          role: 'system',
          content: `Você é o assistente virtual oficial do site AUTIM.
Sua função é responder dúvidas sobre o uso do site e sobre Autismo.

REGRAS:
1. Responda APENAS com base nas informações do contexto fornecido.
2. Se a resposta não estiver no contexto, responda: "Desculpe, não encontrei essa informação no meu material."
3. Seja direto e objetivo.
4. Responda em português.

CONTEXTO:
${contextoSite}`
        },
        {
          role: 'user',
          content: mensagemUsuario
        }
      ],
      stream: false,
      options: {
        temperature: 0.1,
        num_ctx: 2048
      }
    });

    return response?.message?.content || 'Desculpe, não encontrei essa informação no meu material.';
  } catch (error) {
    console.error('Erro ao comunicar com o Ollama:', error);
    throw new Error('Não foi possível processar a resposta da IA.');
  }
}

module.exports = {
  responderDuvida
};
