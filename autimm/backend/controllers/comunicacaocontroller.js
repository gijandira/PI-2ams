const pool = require('../config/db');

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
       ORDER BY c.CAT_ID, m.MID_ID`
    );

    // Agrupa os cards pelo slug da categoria
    const cards = {};
    for (const row of rows) {
      if (!cards[row.catSlug]) cards[row.catSlug] = [];
      cards[row.catSlug].push({
        id:     row.id,
        emoji:  row.emoji,
        label:  row.label,
        bg:     row.bg,
        shadow: row.shadow,
      });
    }

    return res.json({ cards });
  } catch (error) {
    console.error('Erro em getCards:', error);
    return res.status(500).json({ erro: 'Erro ao buscar cards.' });
  }
};