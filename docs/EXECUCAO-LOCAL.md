# Execucao local

O Autim e um unico repositorio com frontend React/Vite, API Node.js, banco MySQL
e documentacao. Execute os comandos a partir da pasta raiz, onde esta o
`package.json`.

## Requisitos

- Node.js e npm.
- MySQL ou MariaDB em execucao.
- RabbitMQ apenas para testar a liberacao de secoes por mensageria.

## Preparar o ambiente

1. Crie o banco `autim` no MySQL e importe `database/autim.sql`.
2. Na pasta `backend`, crie `.env` usando `.env.example` como referencia. Se ja
   houver um `.env`, ajuste apenas os valores necessarios e nao o sobrescreva.
3. Configure `DB_HOST`, `DB_USER`, `DB_PASS` e `DB_NAME`. Para o fluxo de
   liberacao com RabbitMQ, configure tambem `AMQP_URL` com a URL AMQP completa
   do seu servidor local.
4. Instale as dependencias dos dois modulos na raiz:

   ```sh
   npm run install:all
   ```

## Iniciar a aplicacao

Abra dois terminais na raiz do repositorio:

```sh
npm run dev:backend
```

```sh
npm run dev:frontend
```

A API fica em `http://localhost:3001` e o Vite mostra no terminal o endereco do
frontend (normalmente `http://localhost:5173`). Deixe os dois terminais abertos.

## Comandos uteis

| Comando | Acao |
| --- | --- |
| `npm run build:frontend` | Gera a versao de producao do frontend |
| `npm run lint:frontend` | Executa o ESLint do frontend |
| `npm run test:backend` | Executa os testes padrao do backend |
| `npm run test:rf07` | Executa os testes RF07 do backend |
| `npm run test:integration` | Executa os testes locais de integracao |

O backend tambem pode ser iniciado em modo normal com `npm run start:backend`.

Para configurar e validar RabbitMQ, consulte
[Integracao local com RabbitMQ](./INTEGRACAO-RABBITMQ.md).
