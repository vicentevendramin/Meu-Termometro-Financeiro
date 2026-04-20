const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'financeapp',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

// Testa a conexão ao iniciar
pool.connect((err, client, release) => {
  if (err) {
    console.error('Erro ao conectar ao PostgreSQL:', err.message);
  } else {
    console.log('PostgreSQL conectado com sucesso!');
    release();
  }
});

module.exports = pool;
