const cron = require('node-cron');
const pool = require('../config/db');
const emailService = require('./emailService');

// Armazenar referência do job para poder parar depois
let notificationJob = null;

/**
 * Iniciar o agendador de notificações
 * Executa todos os dias às 09:00 da manhã
 */
exports.iniciarAgendadorNotificacoes = () => {
  // Agendar para executar todos os dias às 09:00
  notificationJob = cron.schedule('0 9 * * *', async () => {
    console.log('🔔 Iniciando verificação de notificações de eventos...');
    await verificarEventosProximos();
  });

  console.log('✅ Agendador de notificações iniciado - executará diariamente às 09:00');

  // Também agendar notificações de medicações (duas vezes ao dia: 08:00 e 20:00)
  const jobMedicacoes1 = cron.schedule('0 8 * * *', async () => {
    console.log('💊 Verificando notificações de medicações (08:00)...');
    await verificarMedicacoesAtivas();
  });

  const jobMedicacoes2 = cron.schedule('0 20 * * *', async () => {
    console.log('💊 Verificando notificações de medicações (20:00)...');
    await verificarMedicacoesAtivas();
  });

  console.log('✅ Agendador de medicações iniciado - executará às 08:00 e 20:00');

  return { notificationJob, jobMedicacoes1, jobMedicacoes2 };
};

/**
 * Parar o agendador
 */
exports.pararAgendador = () => {
  if (notificationJob) {
    notificationJob.stop();
    console.log('⏸️ Agendador de notificações parado');
  }
};

/**
 * Verificar eventos para amanhã e enviar notificações
 */
async function verificarEventosProximos() {
  try {
    // Calcular data de amanhã
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    // Formato: YYYY-MM-DD HH:MM:SS
    const dataInicio = new Date(amanha);
    dataInicio.setHours(0, 0, 0, 0);

    const dataFim = new Date(amanha);
    dataFim.setHours(23, 59, 59, 999);

    // Buscar eventos de amanhã
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
      WHERE DATE(ea.EVE_DT_INICIO) = DATE(?)
      ORDER BY ea.EVE_DT_INICIO ASC`,
      [amanha]
    );

    if (eventos.length === 0) {
      console.log('📭 Nenhum evento encontrado para amanhã');
      return;
    }

    console.log(`📅 Encontrados ${eventos.length} evento(s) para amanhã. Enviando notificações...`);

    // Enviar email para cada evento
    for (const evento of eventos) {
      try {
        const resultado = await emailService.enviarNotificacaoEvento(
          evento.USU_EMAIL,
          evento.USU_NOME,
          evento.ALU_NOME,
          evento
        );

        if (resultado.sucesso) {
          console.log(`✅ Email enviado para ${evento.USU_EMAIL} sobre "${evento.EVE_TITULO}"`);
        } else {
          console.error(`❌ Erro ao enviar email para ${evento.USU_EMAIL}:`, resultado.erro);
        }
      } catch (erro) {
        console.error(`❌ Erro ao processar evento ${evento.EVE_ID}:`, erro.message);
      }
    }

  } catch (erro) {
    console.error('❌ Erro ao verificar eventos próximos:', erro);
  }
}

/**
 * Verificar medicações ativas e enviar notificações
 */
async function verificarMedicacoesAtivas() {
  try {
    const horaAgora = new Date();
    const horarioFormatado = String(horaAgora.getHours()).padStart(2, '0') +
      ':' + String(horaAgora.getMinutes()).padStart(2, '0');

    // Buscar medicações ativas para hoje
    const diaSemana = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'][horaAgora.getDay()];

    const [lembretes] = await pool.query(
      `SELECT 
        lm.LEM_ID,
        lm.LEM_MEDICAMENTO,
        lm.LEM_HORARIO,
        lm.LEM_DIAS,
        lm.LEM_DESCRICAO,
        u.USU_EMAIL,
        u.USU_NOME
      FROM lembrete_medicacao lm
      JOIN usuario u ON lm.USU_ID = u.USU_ID
      WHERE lm.LEM_ATIVO = 1
      AND FIND_IN_SET(?, lm.LEM_DIAS) > 0
      AND HOUR(lm.LEM_HORARIO) = ?
      AND MINUTE(lm.LEM_HORARIO) = ?`,
      [diaSemana, horaAgora.getHours(), horaAgora.getMinutes()]
    );

    if (lembretes.length === 0) {
      console.log('📭 Nenhuma medicação para notificar agora');
      return;
    }

    console.log(`💊 Encontradas ${lembretes.length} medicação(ões) para notificar agora`);

    // Enviar email para cada lembrete
    for (const lembrete of lembretes) {
      try {
        const resultado = await emailService.enviarNotificacaoMedicacao(
          lembrete.USU_EMAIL,
          lembrete.USU_NOME,
          lembrete
        );

        if (resultado.sucesso) {
          console.log(`✅ Email de medicação enviado para ${lembrete.USU_EMAIL}`);
        } else {
          console.error(`❌ Erro ao enviar email de medicação:`, resultado.erro);
        }
      } catch (erro) {
        console.error(`❌ Erro ao processar lembrete ${lembrete.LEM_ID}:`, erro.message);
      }
    }

  } catch (erro) {
    console.error('❌ Erro ao verificar medicações ativas:', erro);
  }
}

/**
 * Testar agendador (executa verificação imediata)
 */
exports.testarAgora = async () => {
  console.log('🧪 Testando verificação imediata de eventos...');
  await verificarEventosProximos();
  console.log('🧪 Testando verificação imediata de medicações...');
  await verificarMedicacoesAtivas();
};
