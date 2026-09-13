const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

async function waitForDatabase(retries = 20, delayMs = 2000) {
  for (let i = 1; i <= retries; i++) {
    try {
      await pool.query('SELECT 1');
      console.log('Banco conectado.');
      return;
    } catch (err) {
      console.log(`Tentativa ${i}/${retries} — banco ainda não respondeu (${err.code}). Retentando em ${delayMs}ms...`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error('Não foi possível conectar ao banco depois de várias tentativas.');
}

module.exports = { pool, waitForDatabase };