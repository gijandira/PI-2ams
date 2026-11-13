# Integracao local com RabbitMQ

Este guia descreve o teste de liberacao de secao: concluir as atividades de
Sentimentos, solicitar a liberacao e confirmar a abertura de Necessidades.

## Iniciar os servicos

1. Inicie o MySQL e confirme que o banco `autim` foi criado e recebeu o schema
   de `database/autim.sql`.
2. Inicie o servico RabbitMQ. O painel local costuma ficar disponivel em
   `http://localhost:15672` e o protocolo AMQP usa a porta `5672`.
3. Na raiz do projeto, confira `backend/.env`. Configure as credenciais do
   MySQL e `AMQP_URL` com uma URL completa usando as credenciais do seu servidor
   RabbitMQ local. Nao reutilize exemplos de credenciais em ambientes expostos.

## Executar

Em dois terminais na raiz, inicie a API e o frontend:

```sh
npm run dev:backend
```

```sh
npm run dev:frontend
```

No painel RabbitMQ, confirme que a fila
`autim.section.unlock.requests` foi criada e que ha um consumidor ativo.
No Autim, use um aluno de teste sem a secao Necessidades previamente liberada,
conclua as cinco atividades de Sentimentos e solicite a proxima secao.

A fila pode voltar rapidamente a zero porque a mensagem e consumida assim que
o estado e atualizado no MySQL. Confirme tambem no aplicativo que Necessidades
foi liberada. O banco e a fonte oficial desse estado; RabbitMQ transporta o
evento.

## Diagnostico

- Fila ausente ou sem consumidor: confira se RabbitMQ esta ativo e se
  `AMQP_URL` esta correto; reinicie a API depois de iniciar RabbitMQ.
- Erro de banco: confira as variaveis `DB_HOST`, `DB_USER`, `DB_PASS` e
  `DB_NAME`, alem do schema importado.
- Botao de solicitacao ausente: confira se as cinco atividades de Sentimentos
  foram concluidas e se o aluno conectado ainda nao tem a secao liberada.
- Mensagem processada sem atualizacao na tela: confira os logs da API e
  recarregue a pagina de Licoes para consultar o estado persistido.
