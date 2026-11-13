const assert = require('node:assert/strict');
const test = require('node:test');

const {
  CircuitBreaker,
  createIdempotentExecutor,
  dispatchOutboxBatch,
  retryWithBackoff
} = require('../distributed-lab/patterns');

// Estes testes exercitam os padrões com dependências simuladas: não acessam
// MySQL, broker, Ollama ou e-mail e devem permanecer rápidos e determinísticos.

test('retry aplica backoff crescente e retorna quando a dependência se recupera', async () => {
  let calls = 0;
  // Captura os intervalos em vez de esperar de verdade para evitar atrasos no teste.
  const delays = [];

  const result = await retryWithBackoff(
    async () => {
      calls += 1;
      if (calls < 3) {
        throw new Error('falha transitória');
      }
      return 'ok';
    },
    {
      maxAttempts: 3,
      baseDelayMs: 10,
      wait: async (milliseconds) => delays.push(milliseconds)
    }
  );

  assert.equal(result, 'ok');
  assert.equal(calls, 3);
  assert.deepEqual(delays, [10, 20]);
});

test('retry não repete erro classificado como permanente', async () => {
  let calls = 0;
  const permanentError = new Error('pedido inválido');

  await assert.rejects(
    retryWithBackoff(
      async () => {
        calls += 1;
        throw permanentError;
      },
      { shouldRetry: () => false, wait: async () => {} }
    ),
    permanentError
  );

  assert.equal(calls, 1);
});

test('idempotência compartilha resultado entre chamadas concorrentes e replays', async () => {
  // O contador representa um efeito externo (por exemplo, cobrar um pagamento).
  let effects = 0;
  const executePayment = createIdempotentExecutor(async (amount) => {
    effects += 1;
    await Promise.resolve();
    return { paymentId: 'payment-1', amount };
  });

  const firstPair = await Promise.all([
    executePayment('request-123', 25),
    executePayment('request-123', 25)
  ]);
  const replay = await executePayment('request-123', 25);

  assert.deepEqual(firstPair[0], { paymentId: 'payment-1', amount: 25 });
  assert.deepEqual(firstPair[1], firstPair[0]);
  assert.deepEqual(replay, firstPair[0]);
  assert.equal(effects, 1);
});

test('idempotência permite nova tentativa após falha da primeira execução', async () => {
  let calls = 0;
  const execute = createIdempotentExecutor(async () => {
    calls += 1;
    if (calls === 1) {
      throw new Error('falha temporária');
    }
    return 'concluído';
  });

  await assert.rejects(execute('request-retry'), /falha temporária/);
  assert.equal(await execute('request-retry'), 'concluído');
  assert.equal(calls, 2);
});

test('circuit breaker abre, bloqueia chamadas e fecha após probe bem-sucedido', async () => {
  // Relógio manual permite avançar o tempo sem esperar pelo timeout real.
  let currentTime = 1_000;
  let calls = 0;
  const breaker = new CircuitBreaker({
    failureThreshold: 2,
    resetTimeoutMs: 500,
    now: () => currentTime
  });
  const unavailable = async () => {
    calls += 1;
    throw new Error('serviço indisponível');
  };

  await assert.rejects(breaker.execute(unavailable), /serviço indisponível/);
  await assert.rejects(breaker.execute(unavailable), /serviço indisponível/);
  assert.equal(breaker.state, 'OPEN');
  // A chamada bloqueada deve falhar antes de invocar a dependência novamente.
  await assert.rejects(
    breaker.execute(unavailable),
    (error) => error.code === 'CIRCUIT_OPEN'
  );
  assert.equal(calls, 2);

  currentTime += 500;
  assert.equal(await breaker.execute(async () => 'recuperado'), 'recuperado');
  assert.equal(breaker.state, 'CLOSED');
});

test('relay de outbox só confirma depois da publicação e deixa mensagem para retry', async () => {
  // Se a publicação falha, o identificador não pode ser marcado como entregue.
  const pending = [{ id: 'event-1', type: 'evento.criado' }];
  const confirmed = [];

  await assert.rejects(
    dispatchOutboxBatch({
      findPending: async () => pending,
      publish: async () => {
        throw new Error('broker indisponível');
      },
      markPublished: async (id) => confirmed.push(id)
    }),
    /broker indisponível/
  );

  assert.deepEqual(confirmed, []);
  assert.equal(pending.length, 1);
});

test('relay de outbox pode reenviar se falhar ao confirmar após publicar', async () => {
  // Simula a janela de falha entre a aceitação no broker e a confirmação no banco.
  const message = { id: 'event-2', type: 'evento.criado' };
  let publishCount = 0;
  let confirmationFails = true;
  const findPending = async () => [message];
  const publish = async () => {
    publishCount += 1;
  };
  const markPublished = async () => {
    if (confirmationFails) {
      confirmationFails = false;
      throw new Error('falha ao atualizar outbox');
    }
  };

  await assert.rejects(
    dispatchOutboxBatch({ findPending, publish, markPublished }),
    /falha ao atualizar outbox/
  );
  // No retry, a mensagem continua pendente e pode ser entregue outra vez.
  assert.equal(await dispatchOutboxBatch({ findPending, publish, markPublished }), 1);

  // A entrega é pelo menos uma vez; o consumidor precisa deduplicar por message.id.
  assert.equal(publishCount, 2);
});
