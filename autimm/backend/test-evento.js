const pool = require('./config/db');

async function testar() {
  try {
    const pool_instance = require('./config/db');
    
    // Criar evento para amanhã
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    amanha.setHours(15, 0, 0, 0);
    
    const dataFim = new Date(amanha);
    dataFim.setHours(16, 0, 0, 0);
    
    const [resultado] = await pool_instance.query(
      `INSERT INTO EVENTO_AGENDA 
       (ALU_ID, EVE_TITULO, EVE_DESCRICAO, EVE_ETIQUETA, EVE_DT_INICIO, EVE_DT_FIM) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        3, 
        'Consulta Médica - Teste', 
        'Consulta com pediatra para avaliação', 
        'saude', 
        amanha.toISOString().slice(0, 19).replace('T', ' '),
        dataFim.toISOString().slice(0, 19).replace('T', ' ')
      ]
    );
    
    console.log('✅ Evento criado com sucesso:', resultado.insertId);
    console.log('Data do evento:', amanha);
    process.exit(0);
  } catch (erro) {
    console.error('❌ Erro:', erro);
    process.exit(1);
  }
}

testar();
