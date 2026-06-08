require('dotenv').config();

const express = require('express');
const cors = require('cors');
const notificationScheduler = require('./services/notificationScheduler');
const emailService = require('./services/emailService');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const authRoutes         = require('./routes/authroutes');
const comunicacaoRoutes  = require('./routes/comunicacaoroutes');
const eventoRoutes       = require('./routes/eventoroutes');

app.use('/auth',         authRoutes);
app.use('/comunicacao',  comunicacaoRoutes);
app.use('/evento',       eventoRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando');
});

// Rota para testar agendador de notificações (apenas para desenvolvimento)
app.get('/test-notifications', async (req, res) => {
  try {
    console.log('Testando agendador...');
    await notificationScheduler.testarAgora();
    res.json({ mensagem: 'Teste de notificações executado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

// Rota para enviar email de teste direto
app.get('/test-email', async (req, res) => {
  try {
    console.log('🧪 Enviando email de teste...');
    const resultado = await emailService.enviarEmailTeste();
    if (resultado.sucesso) {
      res.json({ 
        mensagem: '✅ Email de teste enviado com sucesso!',
        email: resultado.email,
        messageId: resultado.messageId
      });
    } else {
      res.status(500).json({ 
        erro: 'Falha ao enviar email',
        detalhes: resultado.erro
      });
    }
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

app.listen(3001, async () => {
  console.log('Servidor rodando na porta 3001');
  
  // Testar conexão com email
  const emailOk = await emailService.testarConexao();
  
  if (emailOk) {
    // Iniciar agendador de notificações
    notificationScheduler.iniciarAgendadorNotificacoes();
    console.log('✅ Sistema de notificações ativo!');
  } else {
    console.warn('⚠️ Email não está configurado corretamente. Configure as variáveis no .env');
    console.log('📝 Configure no .env:');
    console.log('   EMAIL_SERVICE=gmail');
    console.log('   EMAIL_USER=seu_email@gmail.com');
    console.log('   EMAIL_PASSWORD=sua_senha_app');
    console.log('   EMAIL_FROM=AUTIM <seu_email@gmail.com>');
  }
});
