const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

/**
 * Executa novamente uma operação após falhas transitórias, com espera crescente.
 * O classificador permite não repetir erros permanentes, como validação inválida.
 */
async function retryWithBackoff(
  operation,
  {
    maxAttempts = 3,
    baseDelayMs = 100,
    shouldRetry = () => true,
    wait = sleep
  } = {}
) {
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
    throw new RangeError('maxAttempts deve ser um inteiro maior que zero.');
  }
  if (!Number.isFinite(baseDelayMs) || baseDelayMs < 0) {
    throw new RangeError('baseDelayMs deve ser um número não negativo.');
  }

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await operation(attempt);
    } catch (error) {
      if (attempt === maxAttempts || !shouldRetry(error)) {
        throw error;
      }

      // O atraso dobra a cada falha para reduzir pressão sobre a dependência.
      await wait(baseDelayMs * (2 ** (attempt - 1)));
    }
  }
}

/**
 * Deduplica chamadas concorrentes e replays dentro deste processo.
 * Em produção, substitua o Map por armazenamento compartilhado e durável.
 */
function createIdempotentExecutor(operation) {
  const resultsByKey = new Map();

  return async (idempotencyKey, ...args) => {
    if (typeof idempotencyKey !== 'string' || idempotencyKey.trim() === '') {
      throw new TypeError('A chave de idempotência é obrigatória.');
    }

    if (resultsByKey.has(idempotencyKey)) {
      return resultsByKey.get(idempotencyKey);
    }

    const resultPromise = Promise.resolve().then(() => operation(...args));
    resultsByKey.set(idempotencyKey, resultPromise);

    try {
      return await resultPromise;
    } catch (error) {
      // Uma falha não fica memorizada: o mesmo pedido pode ser tentado de novo.
      if (resultsByKey.get(idempotencyKey) === resultPromise) {
        resultsByKey.delete(idempotencyKey);
      }
      throw error;
    }
  };
}

/**
 * Impede chamadas repetidas a uma dependência que está falhando.
 * O estado é local ao processo; várias instâncias precisam de coordenação externa.
 */
class CircuitBreaker {
  constructor({ failureThreshold = 2, resetTimeoutMs = 1_000, now = Date.now } = {}) {
    if (!Number.isInteger(failureThreshold) || failureThreshold < 1) {
      throw new RangeError('failureThreshold deve ser um inteiro maior que zero.');
    }
    if (!Number.isFinite(resetTimeoutMs) || resetTimeoutMs < 0) {
      throw new RangeError('resetTimeoutMs deve ser um número não negativo.');
    }

    this.failureThreshold = failureThreshold;
    this.resetTimeoutMs = resetTimeoutMs;
    this.now = now;
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.openedAt = null;
    this.probeInFlight = false;
  }

  async execute(operation) {
    let isProbe = false;

    if (this.state === 'OPEN') {
      if (this.now() - this.openedAt < this.resetTimeoutMs) {
        const error = new Error('Circuit breaker aberto; dependência temporariamente bloqueada.');
        error.code = 'CIRCUIT_OPEN';
        throw error;
      }

      this.state = 'HALF_OPEN';
    }

    if (this.state === 'HALF_OPEN') {
      if (this.probeInFlight) {
        const error = new Error('Circuit breaker aguardando o teste de recuperação.');
        error.code = 'CIRCUIT_OPEN';
        throw error;
      }
      this.probeInFlight = true;
      isProbe = true;
    }

    try {
      const result = await operation();
      this.failureCount = 0;
      this.openedAt = null;
      this.state = 'CLOSED';
      return result;
    } catch (error) {
      if (isProbe) {
        this.state = 'OPEN';
        this.openedAt = this.now();
      } else {
        this.failureCount += 1;
        if (this.failureCount >= this.failureThreshold) {
          this.state = 'OPEN';
          this.openedAt = this.now();
        }
      }
      throw error;
    } finally {
      if (isProbe) {
        this.probeInFlight = false;
      }
    }
  }
}

/**
 * Publica itens pendentes antes de marcá-los como enviados.
 * Uma falha entre essas operações pode gerar reenvio: consumidores devem ser
 * idempotentes. A transação que grava evento e outbox deve usar o mesmo banco.
 */
async function dispatchOutboxBatch({ findPending, publish, markPublished, limit = 50 }) {
  const messages = await findPending(limit);
  let publishedCount = 0;

  for (const message of messages) {
    await publish(message);
    await markPublished(message.id);
    publishedCount += 1;
  }

  return publishedCount;
}

module.exports = {
  CircuitBreaker,
  createIdempotentExecutor,
  dispatchOutboxBatch,
  retryWithBackoff
};
