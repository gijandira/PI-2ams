const nodemailer = require('nodemailer');

// Configurar o transportador de email
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    // Ignora a validação de certificado autoassinado no ambiente local
    rejectUnauthorized: false
  }
});

/**
 * Enviar email de notificação de evento
 * @param {string} emailDestino - Email do responsável
 * @param {string} nomeResponsavel - Nome do responsável
 * @param {string} nomeAluno - Nome do aluno
 * @param {object} evento - Dados do evento
 */
exports.enviarNotificacaoEvento = async (emailDestino, nomeResponsavel, nomeAluno, evento) => {
  try {
    const dataEvento = new Date(evento.EVE_DT_INICIO);
    const horaFormatada = dataEvento.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f9f9f9; }
          .container { background: white; border-radius: 8px; overflow: hidden; max-width: 500px; margin: 0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 600; }
          .brand { font-size: 14px; opacity: 0.9; }
          .content { padding: 25px; }
          .box { background: #f5f5f5; padding: 20px; border-radius: 6px; border-left: 4px solid #667eea; }
          .title { font-size: 18px; font-weight: 600; margin: 0 0 10px 0; }
          .info { font-size: 15px; line-height: 1.6; color: #333; }
          .footer { background: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>AUTIM</h1>
            <div class="brand">Seu assistente de bem-estar</div>
          </div>
          <div class="content">
            <div class="box">
              <div class="title">📅 ${evento.EVE_TITULO}</div>
              <div class="info">
                <strong>Horário:</strong> ${horaFormatada}<br>
                ${evento.EVE_DESCRICAO ? `<strong>Detalhes:</strong> ${evento.EVE_DESCRICAO}<br>` : ''}
                <strong>Para:</strong> ${nomeAluno}
              </div>
            </div>
          </div>
          <div class="footer">
            AUTIM © 2026 - Todos os direitos reservados
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: emailDestino,
      subject: `📅 ${evento.EVE_TITULO} - ${horaFormatada}`,
      html: htmlTemplate
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado com sucesso:', info.messageId);
    return { sucesso: true, messageId: info.messageId };

  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return { sucesso: false, erro: error.message };
  }
};

/**
 * Enviar email de notificação de medicação
 * @param {string} emailDestino - Email do responsável
 * @param {string} nomeResponsavel - Nome do responsável
 * @param {object} lembrete - Dados do lembrete de medicação
 */
exports.enviarNotificacaoMedicacao = async (emailDestino, nomeResponsavel, lembrete) => {
  try {
    const horaFormatada = lembrete.LEM_HORARIO.slice(0, 5);

    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f9f9f9; }
          .container { background: white; border-radius: 8px; overflow: hidden; max-width: 500px; margin: 0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 600; }
          .brand { font-size: 14px; opacity: 0.9; }
          .content { padding: 25px; }
          .box { background: #f5f5f5; padding: 20px; border-radius: 6px; border-left: 4px solid #48c378; }
          .title { font-size: 18px; font-weight: 600; margin: 0 0 10px 0; }
          .info { font-size: 15px; line-height: 1.6; color: #333; }
          .footer { background: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>AUTIM</h1>
            <div class="brand">Seu assistente de bem-estar</div>
          </div>
          <div class="content">
            <div class="box">
              <div class="title">⏰ ${lembrete.LEM_MEDICAMENTO}</div>
              <div class="info">
                <strong>Horário:</strong> ${horaFormatada}<br>
                ${lembrete.LEM_DESCRICAO ? `<strong>Instruções:</strong> ${lembrete.LEM_DESCRICAO}` : ''}
              </div>
            </div>
          </div>
          <div class="footer">
            AUTIM © 2026 - Todos os direitos reservados
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: emailDestino,
      subject: `⏰ ${lembrete.LEM_MEDICAMENTO} - ${horaFormatada}`,
      html: htmlTemplate
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email de medicação enviado com sucesso:', info.messageId);
    return { sucesso: true, messageId: info.messageId };

  } catch (error) {
    console.error('Erro ao enviar email de medicação:', error);
    return { sucesso: false, erro: error.message };
  }
};

/**
 * Testar conexão com email
 */
exports.testarConexao = async () => {
  try {
    await transporter.verify();
    console.log('✅ Conexão com email verificada com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao verificar conexão de email:', error);
    return false;
  }
};

/**
 * Enviar email de teste direto
 */
exports.enviarEmailTeste = async () => {
  try {
    const emailDestino = process.env.EMAIL_USER;

    const lembrete = {
      LEM_MEDICAMENTO: 'Dipirona',
      LEM_HORARIO: '08:00:00',
      LEM_DESCRICAO: 'Tomar com água'
    };

    const horaFormatada = lembrete.LEM_HORARIO.slice(0, 5);

    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f9f9f9; }
          .container { background: white; border-radius: 8px; overflow: hidden; max-width: 500px; margin: 0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 600; }
          .brand { font-size: 14px; opacity: 0.9; }
          .content { padding: 25px; }
          .box { background: #f5f5f5; padding: 20px; border-radius: 6px; border-left: 4px solid #48c378; }
          .title { font-size: 18px; font-weight: 600; margin: 0 0 10px 0; }
          .info { font-size: 15px; line-height: 1.6; color: #333; }
          .footer { background: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>AUTIM</h1>
            <div class="brand">Seu assistente de bem-estar</div>
          </div>
          <div class="content">
            <div class="box">
              <div class="title">⏰ ${lembrete.LEM_MEDICAMENTO}</div>
              <div class="info">
                <strong>Horário:</strong> ${horaFormatada}<br>
                <strong>Instruções:</strong> ${lembrete.LEM_DESCRICAO}
              </div>
            </div>
          </div>
          <div class="footer">
            AUTIM © 2026 - Todos os direitos reservados
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: emailDestino,
      subject: `⏰ ${lembrete.LEM_MEDICAMENTO} - ${horaFormatada}`,
      html: htmlTemplate
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de teste enviado com sucesso:', info.messageId);
    return { sucesso: true, messageId: info.messageId, email: emailDestino };

  } catch (error) {
    console.error('❌ Erro ao enviar email de teste:', error);
    return { sucesso: false, erro: error.message };
  }
};
