// Mock in-memory database - Used when PostgreSQL is unavailable
const mockDatabase = {
  users: [
    {
      id: '1',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@smartstay.chuka.edu.ke',
      phoneNumber: '0712345678',
      password: 'admin@123', // Mock password - use admin@123
      isAdmin: true,
      isSubscribed: true,
      subscriptionExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      createdAt: new Date()
    }
  ],
  hostels: [
    {
      id: '1',
      name: 'Kenyatta Hostel',
      description: 'Affordable and convenient hostel near campus',
      location: 'Near Main Gate',
      distance: '0.5',
      phoneNumber: '0712345678',
      caretaker: 'John Doe',
      caretakerPhone: '0712345678',
      image: null,
      amenities: JSON.stringify(['WiFi', 'Hot Water', 'Laundry']),
      roomTypes: JSON.stringify([
        { type: 'Single', price: 500 },
        { type: 'Double', price: 800 }
      ]),
      verified: true,
      ownerId: '1',
      createdAt: new Date()
    },
    {
      id: '2',
      name: 'Campus View Hostel',
      description: 'Modern hostel with great views',
      location: 'Hill Road',
      distance: '1.2',
      phoneNumber: '0712345679',
      caretaker: 'Jane Smith',
      caretakerPhone: '0712345679',
      image: null,
      amenities: JSON.stringify(['WiFi', 'Gym', 'Kitchen']),
      roomTypes: JSON.stringify([
        { type: 'Single', price: 600 },
        { type: 'Dorm', price: 300 }
      ]),
      verified: true,
      ownerId: '1',
      createdAt: new Date()
    }
  ],
  payments: []
};

module.exports = mockDatabase;
