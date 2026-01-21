const User = require('./User');
const Hostel = require('./Hostel');
const Subscription = require('./Subscription');
const Payment = require('./Payment');
const sequelize = require('../../config/database');

// Define relationships
User.hasMany(Subscription, { foreignKey: 'userId', onDelete: 'CASCADE' });
Subscription.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Payment, { foreignKey: 'userId', onDelete: 'CASCADE' });
Payment.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Hostel, { foreignKey: 'ownerId' });
Hostel.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

Subscription.hasMany(Payment, { foreignKey: 'subscriptionId' });
Payment.belongsTo(Subscription, { foreignKey: 'subscriptionId' });

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized successfully');
  } catch (err) {
    console.error('❌ Database sync error:', err.message);
  }
};

module.exports = {
  User,
  Hostel,
  Subscription,
  Payment,
  sequelize,
  syncDatabase
};
