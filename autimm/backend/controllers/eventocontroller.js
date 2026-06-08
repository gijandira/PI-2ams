const pool = require('../config/db');

exports.criarEvento = async (req, res) => {
  try {
    const { alunoId, titulo, descricao, dataInicio, dataFim, etiqueta } = req.body;

    if (!alunoId || !titulo || !dataInicio || !dataFim || !etiqueta) {
      return res.status(400).json({
        erro: 'Campos obrigatórios faltando'
      });
    }

    const [resultado] = await pool.query(
      `INSERT INTO EVENTO_AGENDA 
       (ALU_ID, EVE_TITULO, EVE_DESCRICAO, EVE_ETIQUETA, EVE_DT_INICIO, EVE_DT_FIM) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [alunoId, titulo, descricao || null, etiqueta, dataInicio, dataFim]
    );

    res.status(201).json({
      sucesso: true,
      eventoId: resultado.insertId,
      mensagem: 'Evento criado com sucesso'
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      erro: 'Erro ao criar evento'
    });
  }
};

exports.listarEventos = async (req, res) => {
  try {
    const { alunoId } = req.query;

    if (!alunoId) {
      return res.status(400).json({
        erro: 'ID do aluno é obrigatório'
      });
    }

    const [eventos] = await pool.query(
      `SELECT EVE_ID, ALU_ID, EVE_TITULO, EVE_DESCRICAO, EVE_ETIQUETA, 
              EVE_DT_INICIO, EVE_DT_FIM, EVE_DTCAD 
       FROM EVENTO_AGENDA 
       WHERE ALU_ID = ?
       ORDER BY EVE_DT_INICIO ASC`,
      [alunoId]
    );

    res.json({
      eventos: eventos
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      erro: 'Erro ao listar eventos'
    });
  }
};

exports.atualizarEvento = async (req, res) => {
  try {
    const { eventoId } = req.params;
    const { titulo, descricao, dataInicio, dataFim, etiqueta } = req.body;

    const [resultado] = await pool.query(
      `UPDATE EVENTO_AGENDA 
       SET EVE_TITULO = ?, EVE_DESCRICAO = ?, EVE_ETIQUETA = ?, 
           EVE_DT_INICIO = ?, EVE_DT_FIM = ? 
       WHERE EVE_ID = ?`,
      [titulo, descricao || null, etiqueta, dataInicio, dataFim, eventoId]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        erro: 'Evento não encontrado'
      });
    }

    res.json({
      sucesso: true,
      mensagem: 'Evento atualizado com sucesso'
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      erro: 'Erro ao atualizar evento'
    });
  }
};

exports.deletarEvento = async (req, res) => {
  try {
    const { eventoId } = req.params;

    const [resultado] = await pool.query(
      `DELETE FROM EVENTO_AGENDA WHERE EVE_ID = ?`,
      [eventoId]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        erro: 'Evento não encontrado'
      });
    }

    res.json({
      sucesso: true,
      mensagem: 'Evento deletado com sucesso'
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      erro: 'Erro ao deletar evento'
    });
  }
};
