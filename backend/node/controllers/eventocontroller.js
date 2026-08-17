const pool = require('../config/db');
const notificationScheduler = require('../services/notificationScheduler');

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

    const eventoId = resultado.insertId;
    
    // Agendar notificação 1 hora antes do evento
    const dataHoraEvento = new Date(dataInicio);
    notificationScheduler.agendarNotificacaoEventoUmaHoraAntes(eventoId, dataHoraEvento, alunoId);

    res.status(201).json({
      sucesso: true,
      eventoId: eventoId,
      mensagem: 'Evento criado com sucesso e notificação agendada'
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

    // Buscar dados antigos do evento para cancelar notificação anterior
    const [eventoAntigo] = await pool.query(
      `SELECT ALU_ID FROM EVENTO_AGENDA WHERE EVE_ID = ?`,
      [eventoId]
    );

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

    // Cancelar notificação anterior
    notificationScheduler.cancelarNotificacaoEvento(eventoId);

    // Agendar nova notificação 1 hora antes do novo horário
    if (eventoAntigo.length > 0) {
      const dataHoraEvento = new Date(dataInicio);
      notificationScheduler.agendarNotificacaoEventoUmaHoraAntes(
        eventoId, 
        dataHoraEvento, 
        eventoAntigo[0].ALU_ID
      );
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

    // Cancelar notificação agendada do evento
    notificationScheduler.cancelarNotificacaoEvento(eventoId);

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
