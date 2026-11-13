const amqp = require('amqplib');
const { randomUUID } = require('crypto');
const sectionAccessService = require('./sectionAccessService');

const queueName = 'autim.section.unlock.requests';
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost';

let connection = null;
let channel = null;
let connecting = null;
let retryTimer = null;

const agendarReconexao = () => {
  if (retryTimer) return;
  retryTimer = setTimeout(() => {
    retryTimer = null;
    garantirConexao().catch(error => {
      console.error('Não foi possível reconectar ao RabbitMQ:', error.message);
    });
  }, 5000);
  retryTimer.unref();
};

const processarMensagem = async (mensagem, canalAtual) => {
  if (!mensagem) return;

  let evento;
  try {
    evento = JSON.parse(mensagem.content.toString());
  } catch (error) {
    console.error('Mensagem inválida na fila de liberação de seção:', error.message);
    canalAtual.nack(mensagem, false, false);
    return;
  }

  if (
    !evento
    || evento.tipo !== 'solicitar-liberacao-secao'
    || !Number.isInteger(Number(evento.alunoId))
    || Number(evento.alunoId) <= 0
  ) {
    console.error('Evento inválido na fila de liberação de seção.');
    canalAtual.nack(mensagem, false, false);
    return;
  }

  try {
    await sectionAccessService.processarSolicitacao(Number(evento.alunoId));
    canalAtual.ack(mensagem);
  } catch (error) {
    console.error('Erro ao processar solicitação de liberação de seção:', error);
    canalAtual.nack(mensagem, false, true);
  }
};

const conectar = async () => {
  const novaConexao = await amqp.connect(amqpUrl);
  const novoCanal = await novaConexao.createConfirmChannel();
  await novoCanal.assertQueue(queueName, { durable: true });
  await novoCanal.consume(
    queueName,
    mensagem => processarMensagem(mensagem, novoCanal),
    { noAck: false }
  );

  connection = novaConexao;
  channel = novoCanal;

  novaConexao.on('error', error => {
    console.error('Conexão com RabbitMQ apresentou erro:', error.message);
  });
  novaConexao.on('close', () => {
    if (connection === novaConexao) {
      connection = null;
      channel = null;
      agendarReconexao();
    }
  });

  republicarPendentes().catch(error => {
    console.error('Erro ao reenviar solicitações pendentes ao RabbitMQ:', error);
  });
};

const garantirConexao = async () => {
  if (connection && channel) return;
  if (!connecting) {
    connecting = conectar().finally(() => {
      connecting = null;
    });
  }
  try {
    await connecting;
  } catch (error) {
    agendarReconexao();
    throw error;
  }
};

const publicar = async alunoId => {
  await garantirConexao();
  const canalAtual = channel;
  if (!canalAtual) throw new Error('Canal RabbitMQ indisponível.');
  canalAtual.sendToQueue(
    queueName,
    Buffer.from(JSON.stringify({
      tipo: 'solicitar-liberacao-secao',
      alunoId,
      eventoId: randomUUID(),
      criadoEm: new Date().toISOString()
    })),
    { persistent: true, contentType: 'application/json' }
  );
  await canalAtual.waitForConfirms();
};

async function republicarPendentes() {
  const alunosIds = await sectionAccessService.obterSolicitacoesPendentes();
  for (const alunoId of alunosIds) {
    await publicar(alunoId);
  }
}

exports.iniciar = garantirConexao;
exports.publicarSolicitacaoLiberacao = publicar;
