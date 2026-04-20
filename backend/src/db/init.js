require('dotenv').config();
const pool = require('../config/database');

const createTables = async () => {
  const client = await pool.connect();

  try {
    console.log('Inicializando banco de dados...');

    await client.query('BEGIN');

    // Tabela de usuários
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id          SERIAL PRIMARY KEY,
        email       VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at  TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('Tabela "users" criada/verificada.');

    // Tabela de transações
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id          SERIAL PRIMARY KEY,
        user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        description VARCHAR(255) NOT NULL,
        amount      NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
        date        DATE NOT NULL,
        type        VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
        category    VARCHAR(100) NOT NULL,
        created_at  TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('Tabela "transactions" criada/verificada.');

    // Index para buscas rápidas por usuário
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_transactions_user_id
      ON transactions(user_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_transactions_date
      ON transactions(user_id, date DESC);
    `);

    await client.query('COMMIT');
    console.log('Banco de dados inicializado com sucesso!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro ao inicializar banco:', err.message);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
};

createTables();
