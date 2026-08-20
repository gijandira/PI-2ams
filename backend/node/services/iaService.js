const ollamaModule = require('ollama');
const ollama = ollamaModule.default || ollamaModule;

/**
 * Limpa a resposta da IA para remover caracteres estranhos, markdown bruto e símbolos indesejados (#, *, crases, etc) mantendo emojis.
 * @param {string} texto
 * @returns {string}
 */
function limparResposta(texto) {
  if (!texto || typeof texto !== 'string') return '';

  let limpo = texto;

  // 1. Remove caracteres não-latinos (chineses, japoneses, etc)
  limpo = limpo.replace(/[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af]/g, '');

  // 2. Remove títulos markdown (###, ####, #, etc)
  limpo = limpo.replace(/^#{1,6}\s*/gm, '');

  // 3. Remove asteriscos de negrito e itálico (**texto** ou *texto*)
  limpo = limpo.replace(/\*\*(.*?)\*\*/g, '$1');
  limpo = limpo.replace(/\*(.*?)\*/g, '$1');
  limpo = limpo.replace(/[*#`_~]/g, '');

  // 4. Remove reticências soltas em linhas isoladas (...)
  limpo = limpo.replace(/^\s*\.{3,}\s*$/gm, '');

  // 5. Remove links ou URLs inventadas
  limpo = limpo.replace(/https?:\/\/[^\s]+/g, '');

  // 6. Remove quebras de linha triplas ou excessivas
  limpo = limpo.replace(/\n{3,}/g, '\n\n');

  return limpo.trim();
}

/**
 * Envia uma pergunta para o Ollama utilizando o modelo qwen2.5:0.5b.
 * A IA assume a identidade de "Timi", assistente virtual oficial do AUTIM.
 * @param {string} mensagemUsuario - A dúvida enviada pelo usuário.
 * @param {string} contextoSite - Base de conhecimento clínica e do sistema.
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
          content: `Você é a Timi, a assistente virtual e companheira dos pais no AUTIM.

ESTILO DE CONVERSA:
- Fale de forma acolhedora, amigável, humana e gentil, como um verdadeiro suporte aos pais.
- Use emojis bonitos e pertinentes (🌿, 💙, 🧩, ✨, 😊, 💬, ⚙️, 📅, 🎙️) para tornar a resposta calorosa.
- Responda em parágrafos curtos, fluidos e fáceis de ler (1 a 3 parágrafos curtos).
- NÃO use #, ###, **** ou crases. Escreva texto natural e limpo.

EXEMPLOS DO SEU TOM DE RESPOSTA:
Exemplo 1: "Entendo perfeitamente! Nesses momentos de agitação, atividades de respiração e pausas sensoriais costumam ajudar bastante. Uma boa ideia é ir na aba Comunicação e focar em sentimentos calmos como 'tranquilo' ou 'em paz' 🌿💙"
Exemplo 2: "Para mudar a voz do narrador, é super simples! Acesse a aba Configurações (⚙️) e role até 'Voz do Narrador'. Lá você pode escolher entre Feminina, Masculina ou Infantil e testar a velocidade da fala 🎙️✨"
Exemplo 3: "O AUTIM foi feito para facilitar sua rotina! Você tem a Comunicação para cartões PECS que falam em voz alta 💬, a Agenda para organizar terapias e lições 📅, e as Configurações para personalizar a experiência. Estou aqui sempre que precisar! 🧩😊"

BASE DE CONHECIMENTO:
${contextoSite}`
        },
        {
          role: 'user',
          content: mensagemUsuario
        }
      ],
      stream: false,
      options: {
        temperature: 0.35,
        repeat_penalty: 1.25,
        repeat_last_n: 128,
        top_p: 0.85,
        num_ctx: 3072,
        num_predict: 280
      }
    });

    const conteudo = response?.message?.content || 'Desculpe, não consegui processar sua pergunta agora. Tente novamente em instantes. 💙';
    return limparResposta(conteudo);
  } catch (error) {
    console.error('Erro ao comunicar com o Ollama:', error);
    throw new Error('Não foi possível processar a resposta da IA.');
  }
}

module.exports = {
  responderDuvida
};
