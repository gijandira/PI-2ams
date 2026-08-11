# 📧 Sistema de Notificações por Email - AUTIM

Este arquivo documenta como configurar e usar o sistema automático de notificações por email.

## 🎯 Funcionalidades

O sistema envia notificações por email em duas situações:

1. **Lembretes de Eventos/Compromissos**
   - Envia email um dia antes do compromisso
   - Inclui: título, data, hora, tipo e descrição
   - Horário: Diariamente às 09:00

2. **Lembretes de Medicações**
   - Envia email no horário configurado do medicamento
   - Horários: 08:00 e 20:00 (verifica medicações ativas)
   - Inclui: nome do medicamento, dias, instruções

## ⚙️ Configuração

### Passo 1: Configurar variáveis de ambiente

Edite o arquivo `.env` na pasta `backend/`:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=sua_senha_app
EMAIL_FROM=AUTIM <seu_email@gmail.com>
```

### Passo 2: Gerar senha de aplicativo (Gmail)

Se usar Gmail, você precisa gerar uma senha de aplicativo:

1. Acesse: https://myaccount.google.com/security
2. Ative a "Verificação em 2 etapas" (se não estiver ativada)
3. Vá para "Senhas de app"
4. Selecione "Mail" e "Windows Computer"
5. Copie a senha gerada e cole no `.env` como `EMAIL_PASSWORD`

### Passo 3: Instalar dependências

As dependências já foram instaladas com:
```bash
npm install nodemailer node-cron
```

## 🚀 Como usar

### Iniciar o servidor

```bash
cd backend
npm run dev  # para desenvolvimento com nodemon
npm start    # para produção
```

O servidor:
- Testa a conexão com email ao iniciar
- Ativa automaticamente os agendadores
- Mostra status dos serviços no console

### Verificar se está funcionando

1. **Via API (teste manual)**:
   - GET: `http://localhost:3001/test-notifications`
   - Retorna mensagem de sucesso e executa os agendadores

2. **Monitorar no console**:
   ```
   ✅ Conexão com email verificada com sucesso!
   ✅ Agendador de notificações iniciado - executará diariamente às 09:00
   ✅ Agendador de medicações iniciado - executará às 08:00 e 20:00
   ✅ Sistema de notificações ativo!
   ```

## 📅 Cronograma de execução

| Tarefa | Horário | Frequência | Descrição |
|--------|---------|-----------|-----------|
| Verificar eventos | 09:00 | Diariamente | Busca eventos de amanhã e envia notificações |
| Verificar medicações | 08:00 | Diariamente | Notifica medicações ativas para esse horário |
| Verificar medicações | 20:00 | Diariamente | Notifica medicações ativas para esse horário |

## 🔍 Logs e Debugging

O servidor gera logs que indicam:

```
✅ Email enviado com sucesso para user@email.com sobre "Consulta Médica"
❌ Erro ao enviar email: SMTP connection timeout
🔔 Iniciando verificação de notificações de eventos...
📅 Encontrados 3 evento(s) para amanhã
```

## ⚠️ Possíveis problemas

### Erro: "Invalid login credentials"
- Verifique se `EMAIL_USER` e `EMAIL_PASSWORD` estão corretos
- Se usar Gmail, garanta que gerou a senha de aplicativo corretamente

### Erro: "SMTP connection timeout"
- Verifique sua conexão com internet
- Algumas redes/firewalls podem bloquear SMTP

### Emails não sendo enviados
- Verifique os logs do servidor
- Confirme que os dados estão corretos no banco de dados
- Teste com a rota `/test-notifications`

## 🔧 Variáveis de Ambiente Necessárias

```env
# JWT (já existente)
JWT_SECRET=UmaFraseSuperSecretaEComprida123!@#

# Email (novo)
EMAIL_SERVICE=gmail                              # Serviço de email (gmail, outlook, etc)
EMAIL_USER=seu_email@gmail.com                   # Seu email
EMAIL_PASSWORD=sua_senha_app                     # Senha de aplicativo
EMAIL_FROM=AUTIM <seu_email@gmail.com>           # Remetente do email
```

## 📝 Estrutura de Arquivos

```
backend/
├── services/
│   ├── emailService.js          # Funções para enviar emails
│   └── notificationScheduler.js # Agendador de notificações
├── server.js                     # Servidor (modificado)
├── .env                          # Variáveis (modificado)
└── package.json                  # Dependências (modificado)
```

## 🎨 Templates de Email

Os emails são enviados em HTML com:
- Logo e branding do AUTIM
- Informações claras do evento/medicação
- Cores temáticas por tipo de evento
- Links de ação
- Rodapé profissional

## 🔐 Segurança

- Senhas nunca são armazenadas em logs
- Emails são validados antes do envio
- Conexão SMTP usa TLS/SSL
- Tokens JWT protegem as rotas

## 📞 Suporte

Para mais informações ou problemas:
1. Verifique os logs do console
2. Teste a conexão em `/test-notifications`
3. Confirme todas as variáveis do `.env`
4. Valide que os dados estão no banco de dados
