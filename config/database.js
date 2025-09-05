const { Pool } = require('pg');

let pool = null;

const initDb = () => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    console.log('Подключение к PostgreSQL установлено');
    createTables();
  }
  return pool;
};

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        text TEXT NOT NULL,
        user TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Таблицы созданы/проверены');
  } catch (error) {
    console.error('Ошибка создания таблиц:', error);
  }
};

const getDb = () => {
  if (!pool) {
    throw new Error('База данных не инициализирована');
  }
  return pool;
};

module.exports = { initDb, getDb };
