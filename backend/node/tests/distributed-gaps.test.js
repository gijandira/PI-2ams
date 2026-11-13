const assert = require('node:assert/strict');
const test = require('node:test');

// Estes testes documentam comportamentos ainda ausentes no AUTIM. Rode-os com
// `npm run test:gaps`: as falhas das asserções são intencionais até implementar
// persistência/coordenação/feedback do agendador. Os serviços abaixo são dublês.

function replaceModuleExport(modulePath, exports) {
  const resolvedPath = require.resolve(modulePath);
  const previousModule = require.cache[resolvedPath];

  // Substitui temporariamente um módulo carregado por require, sem tocar no real.
  require.cache[resolvedPath] = {
    id: resolvedPath,
    filename: resolvedPath,
    loaded: true,
    exports
  };

  return () => {
    if (previousModule) {
      require.cache[resolvedPath] = previousModule;
    } else {
      delete require.cache[resolvedPath];
    }
  };
}

function loadSchedulerWithFakes({ query = async () => [[], []], schedule }) {
  // Isola cada "instância" recarregando o agendador com módulos simulados.
  const cron = require('node-cron');
  const schedulerPath = require.resolve('../services/notificationScheduler');
  const previousScheduler = require.cache[schedulerPath];
  const originalSchedule = cron.schedule;
  const restorePool = replaceModuleExport('../config/db', { query });
  const restoreEmail = replaceModuleExport('../services/emailService', {
    enviarNotificacaoEvento: async () => ({ sucesso: true })
  });

  cron.schedule = schedule || (() => ({ stop() {} }));
  delete require.cache[schedulerPath];

  return {
    scheduler: require('../services/notificationScheduler'),
    cleanup() {
      cron.schedule = originalSchedule;
      restorePool();
      restoreEmail();
      if (previousScheduler) {
        require.cache[schedulerPath] = previousScheduler;
      } else {
        delete require.cache[schedulerPath];
      }
    }
  };
}

test('GAP 1: inicialização recupera do banco os lembretes pendentes após reinício', async () => {
  let queryCount = 0;
  // A consulta simulada registra se a inicialização tentou recuperar eventos.
  const { scheduler, cleanup } = loadSchedulerWithFakes({
    query: async () => {
      queryCount += 1;
      return [[], []];
    }
  });

  try {
    await scheduler.iniciarAgendadorNotificacoes();

    // Lacuna atual: iniciarAgendadorNotificacoes apenas imprime uma mensagem.
    assert.ok(queryCount > 0, 'o agendador deveria consultar os eventos pendentes persistidos');
  } finally {
    cleanup();
  }
});

test('GAP 2: duas instâncias não criam dois lembretes para o mesmo evento', async () => {
  let scheduledJobs = 0;
  const schedule = () => {
    scheduledJobs += 1;
    return { stop() {} };
  };
  const first = loadSchedulerWithFakes({ schedule });
  const second = loadSchedulerWithFakes({ schedule });

  try {
    // O mesmo evento chega a duas instâncias com relógios/estados independentes.
    const eventTime = new Date(Date.now() + 2 * 60 * 60 * 1000);
    await first.scheduler.agendarNotificacaoEventoUmaHoraAntes(501, eventTime, 10);
    await second.scheduler.agendarNotificacaoEventoUmaHoraAntes(501, eventTime, 10);

    // Lacuna atual: cada instância agenda seu próprio job local.
    assert.equal(scheduledJobs, 1, 'o mesmo evento deveria ter apenas um job ativo');
  } finally {
    second.cleanup();
    first.cleanup();
  }
});

test('GAP 3: API informa quando o evento foi criado mas o lembrete não foi agendado', async () => {
  // Simula autorização e gravação com sucesso, sem conectar ao banco real.
  const restorePool = replaceModuleExport('../config/db', {
    async query(sql) {
      if (sql.includes('SELECT SOL_ID')) {
        return [[{ SOL_ID: 1 }], []];
      }
      if (sql.includes('INSERT INTO EVENTO_AGENDA')) {
        return [{ insertId: 9001 }, []];
      }
      throw new Error(`Consulta inesperada no teste: ${sql}`);
    }
  });
  const restoreScheduler = replaceModuleExport('../services/notificationScheduler', {
    agendarNotificacaoEventoUmaHoraAntes: async () => false,
    cancelarNotificacaoEvento: () => true
  });
  const controllerPath = require.resolve('../controllers/eventocontroller');
  const previousController = require.cache[controllerPath];
  delete require.cache[controllerPath];

  try {
    const controller = require('../controllers/eventocontroller');
    const response = {
      statusCode: 200,
      body: undefined,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(body) {
        this.body = body;
        return this;
      }
    };

    // O dublê do agendador retorna false para representar falha ao criar o job.
    await controller.criarEvento(
      {
        userId: 40,
        userTipo: 'instituicao',
        body: {
          alunoId: 10,
          titulo: 'Consulta de teste',
          descricao: 'Teste controlado',
          dataInicio: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
          dataFim: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          etiqueta: 'saude'
        }
      },
      response
    );

    // Lacuna atual: a rota responde sucesso sem refletir o resultado do agendamento.
    assert.equal(response.statusCode, 201);
    assert.equal(response.body.notificationAgendada, false);
  } finally {
    restoreScheduler();
    restorePool();
    if (previousController) {
      require.cache[controllerPath] = previousController;
    } else {
      delete require.cache[controllerPath];
    }
  }
});
