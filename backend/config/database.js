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
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false
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
    console.log('⚠️  Running in mock mode - database features limited');
  });

module.exports = sequelize;
