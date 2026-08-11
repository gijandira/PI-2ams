const cron = require('node-cron');
const pool = require('../config/db');
const emailService = require('./emailService');

// Armazenar jobs dinâmicos de eventos (mapeado por EVE_ID)
const dynamicEventJobs = {};

/**
 * Iniciar o agendador de notificações de eventos
 */
exports.iniciarAgendadorNotificacoes = () => {
  console.log('✅ Agendador de notificações de eventos pronto. Eventos serão agendados no momento da criação.');
};

/**
 * Testar serviço de notificações de eventos
 */
exports.testarAgora = async () => {
  console.log('🧪 O serviço de notificações de eventos está ativo. Não há agendamentos fixos para eventos.');
};

/**
 * Agendar notificação de evento 1 hora antes
 * @param {number} eventoId - ID do evento
 * @param {Date} dataHoraEvento - Data e hora do evento
 * @param {number} alunoId - ID do aluno
 */
exports.agendarNotificacaoEventoUmaHoraAntes = async (eventoId, dataHoraEvento, alunoId) => {
  try {
    // Calcular 1 hora antes do evento
    const dataNotificacao = new Date(dataHoraEvento);
    dataNotificacao.setHours(dataNotificacao.getHours() - 1);

    // Verificar se a data é válida e está no futuro
    if (dataNotificacao <= new Date()) {
      console.log(`⏭️ Evento ${eventoId} já passou ou está muito próximo, notificação não agendada`);
      return false;
    }

    // Se já existe um job para este evento, parar antes de criar novo
    if (dynamicEventJobs[eventoId]) {
      dynamicEventJobs[eventoId].stop();
      delete dynamicEventJobs[eventoId];
    }

    // Formatar para cron: minuto hora dia mês dia_semana
    const minuto = dataNotificacao.getMinutes();
    const hora = dataNotificacao.getHours();
    const dia = dataNotificacao.getDate();
    const mes = dataNotificacao.getMonth() + 1; // getMonth retorna 0-11
    const cronExpression = `${minuto} ${hora} ${dia} ${mes} *`;

    console.log(`⏰ Agendando notificação para evento ${eventoId} às ${hora}:${String(minuto).padStart(2, '0')}`);

    // Agendar o job
    const job = cron.schedule(cronExpression, async () => {
      console.log(`📧 Enviando notificação 1h antes do evento ${eventoId}...`);
      await enviarNotificacaoEventoComDados(eventoId, alunoId);
      
      // Remover o job após executar
      if (dynamicEventJobs[eventoId]) {
        dynamicEventJobs[eventoId].stop();
        delete dynamicEventJobs[eventoId];
      }
    });

    // Armazenar o job
    dynamicEventJobs[eventoId] = job;
    console.log(`✅ Notificação agendada para evento ${eventoId}`);
    
    return true;

  } catch (erro) {
    console.error(`❌ Erro ao agendar notificação para evento ${eventoId}:`, erro.message);
    return false;
  }
};

/**
 * Cancelar notificação agendada de um evento
 * @param {number} eventoId - ID do evento
 */
exports.cancelarNotificacaoEvento = (eventoId) => {
  try {
    if (dynamicEventJobs[eventoId]) {
      dynamicEventJobs[eventoId].stop();
      delete dynamicEventJobs[eventoId];
      console.log(`⏹️ Notificação cancelada para evento ${eventoId}`);
      return true;
    }
    return false;
  } catch (erro) {
    console.error(`❌ Erro ao cancelar notificação do evento ${eventoId}:`, erro.message);
    return false;
  }
};

/**
 * Enviar notificação de evento (consulta dados completos no banco)
 * @param {number} eventoId - ID do evento
 * @param {number} alunoId - ID do aluno
 */
async function enviarNotificacaoEventoComDados(eventoId, alunoId) {
  try {
    // Buscar dados completos do evento
    const [eventos] = await pool.query(
      `SELECT 
        ea.EVE_ID, 
        ea.ALU_ID,
        ea.EVE_TITULO,
        ea.EVE_DESCRICAO,
        ea.EVE_ETIQUETA,
        ea.EVE_DT_INICIO,
        ea.EVE_DT_FIM,
        u.USU_EMAIL,
        u.USU_NOME,
        a.ALU_NOME
      FROM evento_agenda ea
      JOIN aluno_usuario au ON ea.ALU_ID = au.ALU_ID
      JOIN usuario u ON au.USU_ID = u.USU_ID
      JOIN aluno a ON ea.ALU_ID = a.ALU_ID
      WHERE ea.EVE_ID = ? AND ea.ALU_ID = ?`,
      [eventoId, alunoId]
    );

    if (eventos.length === 0) {
      console.log(`⚠️ Evento ${eventoId} não encontrado`);
      return;
    }

    const evento = eventos[0];

    const resultado = await emailService.enviarNotificacaoEvento(
      evento.USU_EMAIL,
      evento.USU_NOME,
      evento.ALU_NOME,
      evento
    );

    if (resultado.sucesso) {
      console.log(`✅ Email enviado 1h antes do evento "${evento.EVE_TITULO}" para ${evento.USU_EMAIL}`);
    } else {
      console.error(`❌ Erro ao enviar email do evento ${eventoId}:`, resultado.erro);
    }

  } catch (erro) {
    console.error(`❌ Erro ao enviar notificação do evento ${eventoId}:`, erro.message);
  }
}
