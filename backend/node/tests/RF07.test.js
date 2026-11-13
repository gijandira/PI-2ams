const test = require('node:test');
const assert = require('node:assert/strict');

const db = require('../config/db');
const comunicacaoController = require('../controllers/comunicacaocontroller');

function buildResponse() {
  return {
    headers: {},
    statusCode: null,
    payload: undefined,
    set(name, value) {
      this.headers[name] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.payload = data;
      return this;
    },
    send(data) {
      this.payload = data;
      return this;
    }
  };
}

test('CT-005 - Deve apresentar imagem e reproduzir áudio do elemento', async () => {
  const originalFetch = global.fetch;
  const originalQuery = db.query;
  const originalKey = process.env.ELEVENLABS_API_KEY;

  process.env.ELEVENLABS_API_KEY = 'fake-key';
  db.query = async (sql) => {
    if (sql.includes('FROM categoria')) {
      return [[{ id: 1, nome: '😊 Sentimentos', icone: null, slug: 'sentimentos' }]];
    }
    if (sql.includes('FROM midia')) {
      return [[{
        id: 7,
        label: 'Feliz',
        emoji: '😄',
        bg: '#f6d7e4',
        shadow: 'rgba(0,0,0,0.2)',
        catSlug: 'sentimentos'
      }]];
    }
    return [[]];
  };

  global.fetch = async (url, options) => {
    assert.match(url, /elevenlabs\.io/i);
    const payload = JSON.parse(options.body);
    assert.equal(payload.text, 'Feliz');
    assert.equal(payload.model_id, 'eleven_multilingual_v2');
    assert.equal(payload.language_code, 'pt');
    assert.ok(payload.voice_settings.speed > 0);

    return {
      ok: true,
      arrayBuffer: async () => Buffer.from('audio-mp3')
    };
  };

  try {
    const categoriaRes = buildResponse();
    await comunicacaoController.getCategorias({}, categoriaRes);
    assert.deepEqual(categoriaRes.payload.categorias[0].slug, 'sentimentos');

    const cardsRes = buildResponse();
    await comunicacaoController.getCards({}, cardsRes);
    assert.equal(cardsRes.payload.cards.sentimentos[0].label, 'Feliz');
    assert.equal(cardsRes.payload.cards.sentimentos[0].emoji, '😄');

    const audioRes = buildResponse();
    await comunicacaoController.textToSpeech({ body: { text: 'Feliz', voice: 'Feminina', speed: 50 } }, audioRes);

    assert.equal(audioRes.headers['Content-Type'], 'audio/mpeg');
    assert.equal(Buffer.from(audioRes.payload).toString('utf8'), 'audio-mp3');
  } finally {
    global.fetch = originalFetch;
    db.query = originalQuery;
    if (originalKey === undefined) delete process.env.ELEVENLABS_API_KEY;
    else process.env.ELEVENLABS_API_KEY = originalKey;
  }
});

test('CT-006 - Deve tratar áudio indisponível sem interromper a atividade', async () => {
  const originalFetch = global.fetch;
  const originalQuery = db.query;
  const originalKey = process.env.ELEVENLABS_API_KEY;

  db.query = async (sql) => {
    if (sql.includes('FROM categoria')) {
      return [[{ id: 1, nome: '😊 Sentimentos', icone: null, slug: 'sentimentos' }]];
    }
    if (sql.includes('FROM midia')) {
      return [[{
        id: 7,
        label: 'Feliz',
        emoji: '😄',
        bg: '#f6d7e4',
        shadow: 'rgba(0,0,0,0.2)',
        catSlug: 'sentimentos'
      }]];
    }
    return [[]];
  };
  delete process.env.ELEVENLABS_API_KEY;
  global.fetch = async () => {
    throw new Error('Áudio indisponível');
  };

  try {
    const cardsRes = buildResponse();
    await comunicacaoController.getCards({}, cardsRes);
    assert.equal(cardsRes.payload.cards.sentimentos[0].label, 'Feliz');

    const audioRes = buildResponse();
    await comunicacaoController.textToSpeech({ body: { text: 'Feliz', voice: 'Feminina', speed: 50 } }, audioRes);

    assert.equal(audioRes.statusCode, 503);
    assert.equal(audioRes.payload.erro, 'ElevenLabs não configurada.');
  } finally {
    global.fetch = originalFetch;
    db.query = originalQuery;
    if (originalKey === undefined) delete process.env.ELEVENLABS_API_KEY;
    else process.env.ELEVENLABS_API_KEY = originalKey;
  }
});
