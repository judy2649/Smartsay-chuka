const { Sequelize } = require('sequelize');
require('dotenv').config();

// PostgreSQL connection using Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME || 'smartstay_chuka',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false,
      connectTimeout: 10000
    }
  }
);

// Test connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ PostgreSQL connected successfully');
  })
  .catch(err => {
    console.error('❌ PostgreSQL connection error:', err.message);
    console.log('⚠️  Database will retry on next operation');
  });

module.exports = sequelize;
