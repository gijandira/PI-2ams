const pool = require('../config/db');

const sentimentosTitulos = [
  'Sentimentos - Fase 1',
  'Sentimentos - Fase 2',
  'Sentimentos - Fase 3',
  'Sentimentos - Fase 4',
  'Sentimentos - Fase 5',
  'Sentimentos - Histórico legado'
];

exports.ensureSchema = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS aluno_secao_acesso (
      ALU_ID INT(10) UNSIGNED NOT NULL,
      SEC_SLUG VARCHAR(50) NOT NULL,
      ACA_STATUS ENUM('pendente', 'liberada', 'recusada') NOT NULL DEFAULT 'pendente',
      ACA_DT_SOLICITACAO DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      ACA_DT_LIBERACAO DATETIME DEFAULT NULL,
      PRIMARY KEY (ALU_ID, SEC_SLUG),
      CONSTRAINT fk_aluno_secao_acesso_aluno
        FOREIGN KEY (ALU_ID) REFERENCES aluno (ALU_ID)
        ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
};

exports.secaoSentimentosConcluida = async alunoId => {
  const [rows] = await pool.query(
    `SELECT COUNT(DISTINCT CASE
       WHEN a.ATI_TITULO = 'Sentimentos - Histórico legado' THEN 'Sentimentos - Fase 1'
       ELSE a.ATI_TITULO
     END) AS concluidas
     FROM SESSAO_ATIVIDADE s
     INNER JOIN ATIVIDADE a ON a.ATI_ID = s.ATI_ID
     WHERE s.ALU_ID = ? AND a.ATI_TITULO IN (${sentimentosTitulos.map(() => '?').join(', ')})`,
    [alunoId, ...sentimentosTitulos]
  );

  return Number(rows[0]?.concluidas || 0) === 5;
};

exports.obterAcessoNecessidades = async alunoId => {
  const [acessos] = await pool.query(
    `SELECT ACA_STATUS FROM aluno_secao_acesso
     WHERE ALU_ID = ? AND SEC_SLUG = 'necessidades' LIMIT 1`,
    [alunoId]
  );
  const status = acessos[0]?.ACA_STATUS || null;

  return {
    liberada: status === 'liberada',
    solicitacao: status
  };
};

exports.processarSolicitacao = async alunoId => {
  const secaoConcluida = await exports.secaoSentimentosConcluida(alunoId);

  if (!secaoConcluida) {
    await pool.query(
      `UPDATE aluno_secao_acesso SET ACA_STATUS = 'recusada'
       WHERE ALU_ID = ? AND SEC_SLUG = 'necessidades' AND ACA_STATUS = 'pendente'`,
      [alunoId]
    );
    return;
  }

  await pool.query(
    `UPDATE aluno_secao_acesso
     SET ACA_STATUS = 'liberada', ACA_DT_LIBERACAO = CURRENT_TIMESTAMP
     WHERE ALU_ID = ? AND SEC_SLUG = 'necessidades' AND ACA_STATUS = 'pendente'`,
    [alunoId]
  );
};

exports.obterSolicitacoesPendentes = async () => {
  const [rows] = await pool.query(
    `SELECT ALU_ID FROM aluno_secao_acesso
     WHERE SEC_SLUG = 'necessidades' AND ACA_STATUS = 'pendente'`
  );
  return rows.map(row => Number(row.ALU_ID));
};

exports.criarSolicitacaoPendente = async alunoId => {
  await pool.query(
    `INSERT INTO aluno_secao_acesso (ALU_ID, SEC_SLUG, ACA_STATUS, ACA_DT_SOLICITACAO)
     VALUES (?, 'necessidades', 'pendente', CURRENT_TIMESTAMP)
     ON DUPLICATE KEY UPDATE
       ACA_STATUS = IF(ACA_STATUS = 'liberada', 'liberada', 'pendente'),
       ACA_DT_SOLICITACAO = IF(ACA_STATUS = 'liberada', ACA_DT_SOLICITACAO, CURRENT_TIMESTAMP)`,
    [alunoId]
  );
};
