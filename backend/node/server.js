require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
//const notificationScheduler = require('./services/notificationScheduler');
const emailService = require('./services/emailService');
const sectionAccessService = require('./services/sectionAccessService');
const rabbitmqService = require('./services/rabbitmqService');

const app = express();

// Criar pasta de uploads se não existir
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(uploadsDir));

const authRoutes         = require('./routes/authroutes');
const comunicacaoRoutes  = require('./routes/comunicacaoroutes');
const eventoRoutes       = require('./routes/eventoroutes');
const iaRoutes           = require('./routes/iaroutes');
const afiliacaoRoutes    = require('./routes/afiliacaoroutes');
const dashboardRoutes    = require('./routes/dashboardroutes');

app.use('/auth',         authRoutes);
app.use('/comunicacao',  comunicacaoRoutes);
app.use('/evento',       eventoRoutes);
app.use('/ia',            iaRoutes);
app.use('/afiliacao',     afiliacaoRoutes);
app.use('/dashboard',     dashboardRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando');
});

const iniciarServidor = async () => {
  let schemaDisponivel = false;
  try {
    await sectionAccessService.ensureSchema();
    schemaDisponivel = true;
  } catch (error) {
    console.error('Não foi possível preparar o armazenamento de liberação de seções:', error);
  }

  app.listen(3001, async () => {
    console.log('Servidor rodando na porta 3001');

    if (schemaDisponivel) {
      try {
        await rabbitmqService.iniciar();
        console.log('✅ Mensageria RabbitMQ para liberação de seções ativa!');
      } catch (error) {
        console.error('Não foi possível iniciar a mensageria RabbitMQ para liberação de seções:', error);
        console.warn('A API continuará ativa; solicitações de liberação ficarão indisponíveis até o RabbitMQ conectar.');
      }
    }

    // Testar conexão com email
    const emailOk = await emailService.testarConexao();

    if (emailOk) {
      // Iniciar agendador de notificações
      //notificationScheduler.iniciarAgendadorNotificacoes();
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
};

iniciarServidor().catch(error => {
  console.error('Erro ao iniciar a API:', error);
  process.exitCode = 1;
});
