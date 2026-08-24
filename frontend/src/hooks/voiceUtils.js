/**
 * Utilitário de Síntese de Voz Nativa (Web Speech API).
 * Funciona 100% offline e direto no navegador, sem bloqueios de rede/CORS.
 */

// Cache de vozes carregadas
let availableVoices = [];
let currentAudio = null;
let currentAudioUrl = null;
let currentRequest = null;
let playbackToken = 0;
const audioCache = new Map();
const audioRequests = new Map();

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
    // Feminina: busca voz feminina natural
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
  playbackToken += 1;
  if (currentRequest) {
    currentRequest.abort();
    currentRequest = null;
  }
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (currentAudioUrl) {
    URL.revokeObjectURL(currentAudioUrl);
    currentAudioUrl = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function getSpeechRate(speed = 50) {
  const value = Number(speed);
  const normalizedSpeed = Number.isFinite(value) ? value : 50;
  return Math.max(0.85, Math.min(1.2, 0.85 + (normalizedSpeed / 100) * 0.35));
}

function getAudioKey(text, settings = {}) {
  return `${settings.voice || 'Feminina'}:${settings.speed ?? 50}:${text.trim()}`;
}

function requestElevenLabsAudio(text, settings = {}) {
  const cacheKey = getAudioKey(text, settings);
  if (audioCache.has(cacheKey)) return Promise.resolve(audioCache.get(cacheKey));
  if (audioRequests.has(cacheKey)) return audioRequests.get(cacheKey).promise;

  const controller = new AbortController();
  const promise = fetch('http://localhost:3001/comunicacao/voz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: controller.signal,
    body: JSON.stringify({ text: text.trim(), voice: settings.voice || 'Feminina', speed: settings.speed ?? 50 })
  }).then(response => {
    if (!response.ok) throw new Error('ElevenLabs indisponível');
    return response.blob();
  }).then(audioBlob => {
    audioCache.set(cacheKey, audioBlob);
    return audioBlob;
  }).finally(() => audioRequests.delete(cacheKey));

  audioRequests.set(cacheKey, { controller, promise });
  return promise;
}

export function preloadSpeech(text, settings = {}) {
  if (typeof window === 'undefined' || !text || !text.trim()) return;
  requestElevenLabsAudio(text, settings).catch(() => {});
}

/**
 * Fala o texto usando ElevenLabs e fallback nativo de forma natural.
 * @param {string} text - Texto a ser falado
 * @param {object} settings - { narrator: boolean, speed: number (0..100), voice: 'Feminina'|'Masculina' }
 * @param {function} [onEnd] - Callback ao finalizar
 */
export function speakText(text, settings = {}, onEnd = null) {
  if (typeof window === 'undefined') {
    if (onEnd) onEnd();
    return;
  }

  if (!text || !text.trim()) {
    if (onEnd) onEnd();
    return;
  }

  stopSpeaking();

  const finish = () => {
    if (onEnd) onEnd();
  };

  const playElevenLabs = async () => {
    const requestToken = playbackToken;
    try {
      const audioBlob = await requestElevenLabsAudio(text, settings);
      if (requestToken !== playbackToken) return 'cancelled';

      currentAudioUrl = URL.createObjectURL(audioBlob);
      currentAudio = new Audio(currentAudioUrl);
      currentAudio.onended = () => { stopSpeaking(); finish(); };
      currentAudio.onerror = () => { stopSpeaking(); finish(); };
      await currentAudio.play();
      return 'played';
    } catch {
      return requestToken === playbackToken ? 'fallback' : 'cancelled';
    }
  };

  playElevenLabs().then(result => {
    if (result !== 'fallback') return;
    if (!('speechSynthesis' in window)) { finish(); return; }

    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = 'pt-BR';

  // Cálculo calibrado de velocidade (rate entre 0.85x e 1.25x para preservar timbre humano natural)
    const profile = settings.voice || 'Feminina';

    utterance.rate = getSpeechRate(settings.speed !== undefined ? settings.speed : 50);
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

  // Seleciona a melhor voz
    const selectedVoice = getBestVoice(profile);
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.onend = finish;
    utterance.onerror = finish;

  // Executa a fala
    window.speechSynthesis.speak(utterance);
  });
}
