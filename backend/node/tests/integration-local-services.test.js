const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const loopbackHosts = new Set(['localhost', '127.0.0.1', '::1']);
const databaseHost = process.env.DB_HOST || 'localhost';

test(
  'integração local: conecta ao MySQL do XAMPP e encontra o schema esperado',
  { timeout: 15_000 },
  async (t) => {
    assert.ok(
      loopbackHosts.has(databaseHost),
      'Para este teste local, DB_HOST deve ser localhost, 127.0.0.1 ou ::1.'
    );

    // O pool é carregado somente depois do .env; assim usamos a configuração
    // local existente sem mostrar usuário, senha ou outros valores de ambiente.
    const pool = require('../config/db');
    t.after(async () => {
      await pool.end();
    });

    const [connectionCheck] = await pool.query(
      'SELECT 1 AS connected, DATABASE() AS selectedDatabase'
    );
    assert.equal(connectionCheck[0].connected, 1);
    assert.ok(connectionCheck[0].selectedDatabase, 'Nenhum banco foi selecionado.');

    const expectedTables = ['aluno', 'aluno_usuario', 'evento_agenda', 'usuario'];
    const [tableRows] = await pool.query(
      `SELECT TABLE_NAME
       FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME IN (?, ?, ?, ?)`,
      expectedTables
    );
    const foundTables = new Set(tableRows.map((row) => row.TABLE_NAME));
    const missingTables = expectedTables.filter((table) => !foundTables.has(table));

    assert.deepEqual(
      missingTables,
      [],
      `O banco conectado não contém todas as tabelas esperadas: ${missingTables.join(', ')}`
    );
  }
);

test(
  'integração local: a Ollama responde pelo serviço de IA do AUTIM',
  { timeout: 180_000 },
  async () => {
    const ollamaModule = require('ollama');
    const ollama = ollamaModule.default || ollamaModule;
    const { responderDuvida } = require('../services/iaService');
    const expectedModel = 'qwen2.5:0.5b';

    const modelList = await ollama.list();
    const modelIsInstalled = modelList.models.some(
      (model) => model.name === expectedModel || model.name.startsWith(`${expectedModel}:`)
    );
    assert.ok(
      modelIsInstalled,
      `O modelo ${expectedModel} não está instalado na Ollama local.`
    );

    // Chamada real, mas sem dados de usuários: valida o caminho de produção da IA.
    const answer = await responderDuvida(
      'Como faço para mudar a voz do narrador no AUTIM? Responda em uma frase curta.'
    );

    assert.equal(typeof answer, 'string');
    assert.ok(answer.trim().length > 0, 'A IA retornou uma resposta vazia.');
  }
);
