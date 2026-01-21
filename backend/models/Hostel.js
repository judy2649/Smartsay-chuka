// Legacy file - re-export the new PostgreSQL/Sequelize model
module.exports = require('./database').Hostel;
  },
  location: {
    type: String,
    required: true
  },
  distance: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  roomTypes: [{
    type: {
      type: String,
      enum: ['Single', 'Double', 'Triple', 'Dormitory']
    },
    price: Number,
    capacity: Number,
    available: Boolean
  }],
  amenities: [String],
  images: [String],
  rating: {
    type: Number,
    default: 0
  },
  reviews: [{
    userId: mongoose.Schema.Types.ObjectId,
    userName: String,
    rating: Number,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Hostel', hostelSchema);
