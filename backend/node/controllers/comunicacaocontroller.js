const pool = require('../config/db');

const VOICE_IDS = {
  Masculina: '7x7tKrzpV4Y3qXZ8OGQX',
  Feminina: 'lPydtncT237xnGTouo4l'
};

exports.textToSpeech = async (req, res) => {
  const { text, voice = 'Feminina', speed = 50 } = req.body || {};
  const voiceId = VOICE_IDS[voice] || VOICE_IDS.Feminina;

  if (!process.env.ELEVENLABS_API_KEY) {
    return res.status(503).json({ erro: 'ElevenLabs não configurada.' });
  }
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ erro: 'Texto para narração não informado.' });
  }

  try {
    const speedValue = Number(speed);
    const safeSpeed = Number.isFinite(speedValue) ? speedValue : 50;
    const normalizedSpeed = Math.max(0.85, Math.min(1.2, 0.85 + (safeSpeed / 100) * 0.35));
    const requestBody = JSON.stringify({
      text: text.trim(),
      model_id: 'eleven_multilingual_v2',
      language_code: 'pt',
      output_format: 'mp3_44100_128',
      voice_settings: { stability: 0.5, similarity_boost: 0.75, speed: normalizedSpeed }
    });
    let response;
    let details = '';
    for (let attempt = 0; attempt < 2; attempt += 1) {
      response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
        body: requestBody
      });
      if (response.ok) break;
      details = await response.text();
      if (![408, 409, 429, 500, 502, 503, 504].includes(response.status) || attempt === 1) break;
      await new Promise(resolve => setTimeout(resolve, 350));
    }

    if (!response.ok) {
      console.error('Erro ElevenLabs:', response.status, details);
      return res.status(502).json({ erro: 'Não foi possível gerar a narração.' });
    }

    res.set('Content-Type', 'audio/mpeg');
    res.set('Cache-Control', 'no-store');
    res.send(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    console.error('Erro ao gerar narração:', error);
    res.status(502).json({ erro: 'Não foi possível conectar à ElevenLabs.' });
  }
};

// Retorna todas as categorias da tela de Comunicação
exports.getCategorias = async (req, res) => {
  try {
    // Adicionado filtro para ignorar registros com slug inválido ou vazio
    const [rows] = await pool.query(
      `SELECT CAT_ID AS id, CAT_NOME AS nome, CAT_ICONE AS icone, CAT_SLUG AS slug
       FROM categoria
       WHERE CAT_SLUG <> '' AND CAT_SLUG IS NOT NULL
       ORDER BY CAT_ID`
    );
    return res.json({ categorias: rows });
  } catch (error) {
    console.error('Erro em getCategorias:', error);
    return res.status(500).json({ erro: 'Erro ao buscar categorias.' });
  }
};

// Retorna todos os cards de áudio agrupados por categoria
exports.getCards = async (req, res) => {
  try {
    // Adicionado filtro c.CAT_SLUG <> '' para garantir integridade no INNER JOIN
    const [rows] = await pool.query(
      `SELECT
          m.MID_ID           AS id,
          m.MID_ROTULO       AS label,
          m.MID_EMOJI        AS emoji,
          m.MID_BG_COLOR     AS bg,
          m.MID_SHADOW_COLOR AS shadow,
          c.CAT_SLUG         AS catSlug
       FROM midia m
       INNER JOIN categoria c ON m.CAT_ID = c.CAT_ID
       WHERE m.MID_TIPO = 'audio' 
         AND c.CAT_SLUG <> '' 
         AND c.CAT_SLUG IS NOT NULL
         AND (c.CAT_SLUG <> 'necessidades' OR m.MID_ID BETWEEN 7 AND 18)
       ORDER BY c.CAT_ID, m.MID_ID`
    );

    const necessidades = {
      7:  { label: 'Quero água', emoji: '💧', bg: '#38a7fb', shadow: 'rgba(56,167,251,.45)' },
      8:  { label: 'Quero comer', emoji: '🍽️', bg: '#fdbe2d', shadow: 'rgba(253,190,45,.45)' },
      9:  { label: 'Ir ao banheiro', emoji: '🚻', bg: '#48c378', shadow: 'rgba(72,195,120,.45)' },
      10: { label: 'Quero descansar', emoji: '🛌', bg: '#5c6bc0', shadow: 'rgba(92,107,192,.4)' },
      11: { label: 'Preciso de ajuda', emoji: '🆘', bg: '#e94542', shadow: 'rgba(233,69,66,.45)' },
      12: { label: 'Quero sair', emoji: '🚪', bg: '#e9589a', shadow: 'rgba(233,88,154,.45)' },
      13: { label: 'Quero brincar', emoji: '🎮', bg: '#38a7fb', shadow: 'rgba(56,167,251,.45)' },
      14: { label: 'Quero silêncio', emoji: '🤫', bg: '#a1887f', shadow: 'rgba(161,136,127,.4)' },
      15: { label: 'Estou com frio', emoji: '🥶', bg: '#5c6bc0', shadow: 'rgba(92,107,192,.4)' },
      16: { label: 'Estou com calor', emoji: '🥵', bg: '#e94542', shadow: 'rgba(233,69,66,.45)' },
      17: { label: 'Não estou bem', emoji: '😟', bg: '#fdbe2d', shadow: 'rgba(253,190,45,.45)' },
      18: { label: 'Preciso de remédio', emoji: '💊', bg: '#48c378', shadow: 'rgba(72,195,120,.45)' },
    };

    // Agrupa os cards pelo slug da categoria
    const cards = {};
    for (const row of rows) {
      if (!cards[row.catSlug]) cards[row.catSlug] = [];
      const card = row.catSlug === 'necessidades' && necessidades[row.id]
        ? necessidades[row.id]
        : row;
      cards[row.catSlug].push({
        id:     row.id,
        emoji:  card.emoji,
        label:  card.label,
        bg:     card.bg,
        shadow: card.shadow,
      });
    }

    return res.json({ cards });
  } catch (error) {
    console.error('Erro em getCards:', error);
    return res.status(500).json({ erro: 'Erro ao buscar cards.' });
  }
};