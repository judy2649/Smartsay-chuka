const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Hostel = sequelize.define('Hostel', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  distance: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  caretaker: {
    type: DataTypes.STRING,
    allowNull: true
  },
  caretakerPhone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  image: {
    type: DataTypes.TEXT, // Store base64 or URL
    allowNull: true
  },
  amenities: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  roomTypes: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'hostels',
  timestamps: true
});

module.exports = Hostel;
