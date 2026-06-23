require('dotenv').config();

const pool = require('./config/db');
const notificationScheduler = require('./services/notificationScheduler');

/**
 * Script de teste para validar sistema de notificações de eventos
 * Cria um evento real no banco e agenda a notificação 1h antes.
 */
async function testarAgendamentoEventos() {
  try {
    console.log('🧪 TESTE DE AGENDAMENTO DE NOTIFICAÇÕES DE EVENTOS');
    console.log('='.repeat(60));

    // Iniciar agendador
    notificationScheduler.iniciarAgendadorNotificacoes();
    console.log('✅ Agendador iniciado\n');

    // Buscar um aluno válido que tenha responsável associado
    const [alunos] = await pool.query(
      `SELECT au.ALU_ID, u.USU_EMAIL, u.USU_NOME
       FROM aluno_usuario au
       JOIN usuario u ON au.USU_ID = u.USU_ID
       LIMIT 1`
    );

    if (alunos.length === 0) {
      throw new Error('Nenhum aluno com responsável encontrado no banco para teste.');
    }

    const alunoId = alunos[0].ALU_ID;
    const agora = new Date();
    const dataEvento = new Date(agora.getTime() + 65 * 60 * 1000); // 1h05min no futuro
    const dataFim = new Date(dataEvento.getTime() + 30 * 60 * 1000); // duração de 30 min
    const dataNotificacao = new Date(dataEvento.getTime() - 60 * 60 * 1000); // 1 hora antes

    console.log('📅 Datas Calculadas:');
    console.log(`   Hora atual:           ${agora.toLocaleTimeString('pt-BR')}`);
    console.log(`   Data/Hora do evento:  ${dataEvento.toLocaleTimeString('pt-BR')}`);
    console.log(`   Notificação em:       ${dataNotificacao.toLocaleTimeString('pt-BR')}`);
    console.log('   (Evento em ~1h05min, Notificação em ~5 min)\n');

    // Inserir evento real no banco
    const titulo = 'Teste de Notificação 1h Antes';
    const descricao = 'Evento de teste para validar disparo de email 1h antes';
    const etiqueta = 'lazer';

    const [insertResult] = await pool.query(
      `INSERT INTO EVENTO_AGENDA (ALU_ID, EVE_TITULO, EVE_DESCRICAO, EVE_ETIQUETA, EVE_DT_INICIO, EVE_DT_FIM)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [alunoId, titulo, descricao, etiqueta, dataEvento, dataFim]
    );

    const eventoId = insertResult.insertId;

    console.log('📝 Evento criado no banco:');
    console.log(`   Evento ID: ${eventoId}`);
    console.log(`   Aluno ID: ${alunoId}`);
    console.log(`   Título: ${titulo}\n`);

    // Agendar notificação
    console.log('⏰ Agendando notificação 1 hora antes...');
    const agendado = await notificationScheduler.agendarNotificacaoEventoUmaHoraAntes(
      eventoId,
      dataEvento,
      alunoId
    );

    if (agendado) {
      console.log('✅ Notificação agendada com sucesso!\n');
      console.log('⏳ Aguardando... A notificação será enviada em aproximadamente 5 minutos.');
      console.log('   Verifique o log do backend no horário de notificação.\n');
    } else {
      console.log('❌ Erro ao agendar notificação\n');
    }

    console.log('✅ Script de teste está ativo. Pressione Ctrl+C para sair.');

  } catch (erro) {
    console.error('❌ Erro no teste:', erro.message);
    process.exit(1);
  }
}

// Executar teste
testarAgendamentoEventos();

// Tratamento para Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n✋ Teste interrompido pelo usuário');
  pool.end();
  process.exit(0);
});
