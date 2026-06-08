# 🚀 Guia Rápido: Configurar Notificações por Email

## Passo 1: Configurar Email (Gmail)

### 1.1 Criar/Usar sua conta Gmail
- Use seu email Gmail pessoal ou crie uma nova

### 1.2 Ativar Autenticação em 2 Fatores
1. Acesse: https://myaccount.google.com
2. Clique em "Segurança" (no menu lateral)
3. Localize "Verificação em 2 etapas"
4. Siga as instruções para ativar

### 1.3 Gerar Senha de Aplicativo
1. Volte em "Segurança"
2. Procure por "Senhas de app"
3. Selecione "Mail" e "Windows Computer"
4. Google vai gerar uma senha de 16 caracteres
5. **Copie essa senha** (você vai usar no .env)

## Passo 2: Atualizar arquivo `.backend/.env`

Abra o arquivo `backend/.env` e atualize com:

```env
JWT_SECRET=UmaFraseSuperSecretaEComprida123!@#

EMAIL_SERVICE=gmail
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=aaaa bbbb cccc dddd
EMAIL_FROM=AUTIM <seu_email@gmail.com>
```

**Substitua:**
- `seu_email@gmail.com` por seu email real
- `aaaa bbbb cccc dddd` pela senha de app gerada (16 caracteres, com espaços)

## Passo 3: Testar Conexão

### 3.1 Iniciar o servidor
```bash
cd backend
npm run dev
```

### 3.2 Verificar se está funcionando
Você deve ver no console:

```
✅ Conexão com email verificada com sucesso!
✅ Agendador de notificações iniciado - executará diariamente às 09:00
✅ Agendador de medicações iniciado - executará às 08:00 e 20:00
✅ Sistema de notificações ativo!
```

### 3.3 Teste manual
Abra no navegador ou Postman:
```
GET http://localhost:3001/test-notifications
```

Você verá resposta:
```json
{
  "mensagem": "Teste de notificações executado com sucesso!"
}
```

## 📧 Como Funciona

### 1️⃣ Notificações de Compromissos
- ⏰ **Quando**: Todos os dias às 09:00 da manhã
- 🔍 **O que**: Verifica eventos/compromissos agendados para amanhã
- 📧 **Envia**: Email para o responsável com:
  - 📅 Data e hora do compromisso
  - 💬 Descrição e tipo (saúde, lazer, esporte, lição)
  - 👶 Nome da criança

**Exemplo:**
```
Assunto: 🔔 Lembrete: Consulta Médica amanhã!

Conteúdo:
- Data: Quinta-feira, 28 de maio de 2026
- Hora: 13:00
- Local: Sala 3
- Tipo: Saúde
```

### 2️⃣ Notificações de Medicações
- ⏰ **Quando**: 08:00 e 20:00 diariamente
- 🔍 **O que**: Verifica medicações ativas no seu perfil
- 📧 **Envia**: Email de lembrete com:
  - 💊 Nome do medicamento
  - 🕐 Horário de tomar
  - 📅 Dias da semana
  - 📝 Instruções (ex: "tomar com água em jejum")

## ✅ Checklist de Configuração

- [ ] Gmail ativado com 2FA
- [ ] Senha de app gerada
- [ ] `.env` atualizado com email e senha
- [ ] Servidor iniciado sem erros
- [ ] Console mostra "✅ Sistema de notificações ativo!"
- [ ] Teste `/test-notifications` retorna sucesso

## 🆘 Problemas Comuns

### "Invalid login credentials"
**Solução:** 
- Copie a senha de app novamente (com todos os espaços)
- Confirme que está usando email correto
- Tente criar nova senha de app

### "SMTP connection timeout"
**Solução:**
- Verifique internet
- Confirme que seu firewall não bloqueia SMTP
- Tente usar outro email (Outlook, Yahoo)

### Emails não chegando
**Solução:**
- Verifique spam/lixo eletrônico
- Teste via `/test-notifications`
- Confira logs do console para mensagens de erro
- Confirme que dados estão corretos no banco

## 📊 Exemplo de Uso Completo

### 1. Criar Compromisso no AUTIM
- Vá para "Agenda"
- Clique "+ Novo evento"
- Preencha: Título, Data (ex: amanhã), Hora, Tipo
- Salve

### 2. Sistema envia Email Automaticamente
- ⏰ Amanhã às 09:00 (ou teste via `/test-notifications`)
- 📧 Email chega na caixa de entrada do responsável
- 📱 Responsável recebe lembrete formal

### 3. Mesmo com Medicações
- Crie lembrete de medicação em "Lembretes"
- Sistema envia email no horário configurado (08:00 ou 20:00)
- Responsável nunca esquece de tomar

## 🎯 Fluxo Completo

```
USUÁRIO CRIA EVENTO/MEDICAÇÃO
           ↓
     SALVA NO BD
           ↓
   AGENDADOR VERIFICA
     (09:00 - eventos)
     (08:00, 20:00 - meds)
           ↓
   ENCONTRA O QUE ENVIAR
           ↓
    VALIDA EMAIL
           ↓
    GERA HTML BONITO
           ↓
    ENVIA EMAIL AUTOMÁTICO
           ↓
   RESPONSÁVEL RECEBE
        NO EMAIL
```

## 📞 Próximos Passos

Depois de tudo configurado:
1. ✅ Criar alguns eventos de teste
2. ✅ Monitorar se emails chegam
3. ✅ Ajustar horários conforme necessário
4. ✅ Compartilhar app com usuários reais

---

**Pronto! Seu sistema de notificações está funcionando! 🎉**
