/**
 * Utilitário de Síntese de Voz Nativa (Web Speech API).
 * Funciona 100% offline e direto no navegador, sem bloqueios de rede/CORS.
 */

// Cache de vozes carregadas
let availableVoices = [];

function refreshVoices() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const list = window.speechSynthesis.getVoices();
    if (list && list.length > 0) {
      availableVoices = list;
    }
  }
}

// Inicialização imediata e listener de vozes do navegador
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    refreshVoices();
  };
}

/**
 * Retorna a melhor voz em português disponível no sistema.
 */
export function getBestVoice(profile = 'Feminina') {
  refreshVoices();
  const voices = availableVoices.length > 0 ? availableVoices : (typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis.getVoices() : []);

  if (!voices || voices.length === 0) return null;

  // Filtra vozes em português (pt-BR ou pt)
  const ptVoices = voices.filter(v => {
    const lang = (v.lang || '').toLowerCase().replace('_', '-');
    return lang.startsWith('pt');
  });

  const pool = ptVoices.length > 0 ? ptVoices : voices;

  const profileLower = (profile || 'Feminina').toLowerCase();

  // Palavras-chave por tipo de voz
  const mascKeywords = ['antonio', 'daniel', 'bruno', 'ricardo', 'felipe', 'yuri', 'thiago', 'male', 'masculina', 'homem'];
  const femKeywords = ['francisca', 'maria', 'leticia', 'camila', 'luciana', 'thalita', 'heloisa', 'ana', 'female', 'feminina', 'mulher', 'zira'];

  if (profileLower === 'masculina') {
    // Tenta encontrar uma voz masculina
    const masc = pool.find(v => {
      const name = (v.name || '').toLowerCase();
      return mascKeywords.some(k => name.includes(k));
    });
    if (masc) return masc;
  } else {
    // Feminina ou Infantil: busca voz feminina natural
    const fem = pool.find(v => {
      const name = (v.name || '').toLowerCase();
      return femKeywords.some(k => name.includes(k));
    });
    if (fem) return fem;
  }

  // Fallback: primeira voz em português ou primeira do sistema
  return ptVoices[0] || voices[0] || null;
}

/**
 * Para qualquer fala em andamento.
 */
export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Fala o texto usando a Web Speech API de forma natural e sem travamentos.
 * @param {string} text - Texto a ser falado
 * @param {object} settings - { narrator: boolean, speed: number (0..100), voice: 'Feminina'|'Masculina'|'Infantil' }
 * @param {function} [onEnd] - Callback ao finalizar
 */
export function speakText(text, settings = {}, onEnd = null) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  if (!text || !text.trim()) {
    if (onEnd) onEnd();
    return;
  }

  // Cancela áudio anterior
  window.speechSynthesis.cancel();

  // Cria o objeto de fala
  const utterance = new SpeechSynthesisUtterance(text.trim());
  utterance.lang = 'pt-BR';

  // Cálculo calibrado de velocidade (rate entre 0.85x e 1.25x para preservar timbre humano natural)
  const speedVal = Number(settings.speed !== undefined ? settings.speed : 50);
  let rate = 0.85 + (speedVal / 100) * 0.40; // 0% -> 0.85x, 50% -> 1.05x, 100% -> 1.25x

  const profile = settings.voice || 'Feminina';
  if (profile === 'Infantil') {
    rate = rate * 1.05; // Leve aceleração alegre para estilo infantil
  }

  utterance.rate = Math.max(0.8, Math.min(1.3, rate));
  utterance.pitch = 1.0; // Pitch fixo em 1.0 para NUNCA gerar voz robótica
  utterance.volume = 1.0;

  // Seleciona a melhor voz
  const selectedVoice = getBestVoice(profile);
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  if (onEnd) {
    utterance.onend = () => onEnd();
    utterance.onerror = () => onEnd();
  }

  // Executa a fala
  window.speechSynthesis.speak(utterance);
}
