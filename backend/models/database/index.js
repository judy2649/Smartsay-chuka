const User = require('./User');
const Hostel = require('./Hostel');
const Subscription = require('./Subscription');
const Payment = require('./Payment');
const sequelize = require('../../config/database');
const bcrypt = require('bcryptjs');

// Define relationships
User.hasMany(Subscription, { foreignKey: 'userId', onDelete: 'CASCADE' });
Subscription.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Payment, { foreignKey: 'userId', onDelete: 'CASCADE' });
Payment.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Hostel, { foreignKey: 'ownerId' });
Hostel.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

Subscription.hasMany(Payment, { foreignKey: 'subscriptionId' });
Payment.belongsTo(Subscription, { foreignKey: 'subscriptionId' });

// Sync database (non-blocking)
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized successfully');
    
    // Create default admin user if doesn't exist
    await createDefaultAdmin();
  } catch (err) {
    console.error('❌ Database sync error:', err.message);
  }
};

// Create default admin user
const createDefaultAdmin = async () => {
  try {
    const adminEmail = 'admin@smartstay.chuka.edu.ke';
    const adminPassword = 'admin@123';
    
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }
    
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: adminEmail,
      phoneNumber: '0712345678',
      password: hashedPassword,
      isAdmin: true,
      isSubscribed: true
    });
    console.log('✅ Default admin user created: admin@smartstay.chuka.edu.ke');
  } catch (err) {
    console.error('Admin creation error:', err.message);
  }
};

// Start sync in background without blocking server startup
syncDatabase().catch(err => console.error('Database sync failed:', err));

module.exports = {
  User,
  Hostel,
  Subscription,
  Payment,
  sequelize,
  syncDatabase,
  createDefaultAdmin
};
