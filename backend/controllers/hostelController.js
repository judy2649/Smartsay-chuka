const Hostel = require('../models/Hostel');
const { uploadImage, uploadFromUrl } = require('../config/cloudinary');

// Mock hostel data for Chuka University
const mockHostels = [
  {
    _id: '1',
    name: 'Chuka Haven Hostel',
    description: 'Comfortable hostel with modern facilities. Clean rooms and friendly staff.',
    location: 'Near Main Gate, Chuka University',
    distance: '0.5 km from campus',
    phoneNumber: '+254712345678',
    caretaker: 'Mr. Peter Mwangi',
    caretakerPhone: '0712345678',
    amenities: ['WiFi', 'Hot Water', '24/7 Security', 'Laundry Service'],
    image: 'https://via.placeholder.com/400x250?text=Chuka+Haven+Hostel',
    roomTypes: [
      { type: 'Single Room', image: 'https://via.placeholder.com/150x100?text=Single+Room' },
      { type: 'Bedsitter', image: 'https://via.placeholder.com/150x100?text=Bedsitter' },
      { type: 'One Bedroom', image: 'https://via.placeholder.com/150x100?text=1+Bedroom' }
    ],
    verified: true
  },
  {
    _id: '2',
    name: 'Sunrise Hostel',
    description: 'Budget-friendly hostel with essential amenities. Great location near the university.',
    location: 'Chuka Town Center',
    distance: '1 km from campus',
    phoneNumber: '+254723456789',
    caretaker: 'Ms. Grace Njeri',
    caretakerPhone: '0723456789',
    amenities: ['WiFi', 'Common Kitchen', 'Shared Bathroom', 'Study Room'],
    image: 'https://via.placeholder.com/400x250?text=Sunrise+Hostel',
    roomTypes: [
      { type: 'Single Room', image: 'https://via.placeholder.com/150x100?text=Single+Room' },
      { type: 'Bedsitter', image: 'https://via.placeholder.com/150x100?text=Bedsitter' }
    ],
    verified: true
  },
  {
    _id: '3',
    name: 'Campus Inn',
    description: 'Premium hostel with excellent facilities. Walking distance to campus.',
    location: 'Next to University Gate',
    distance: '0.3 km from campus',
    phoneNumber: '+254734567890',
    caretaker: 'Mr. David Kipchoge',
    caretakerPhone: '0734567890',
    amenities: ['WiFi', 'Hot Water', '24/7 Security', 'Laundry', 'Study Area', 'TV Lounge'],
    image: 'https://via.placeholder.com/400x250?text=Campus+Inn',
    roomTypes: [
      { type: 'Single Room', image: 'https://via.placeholder.com/150x100?text=Single+Room' },
      { type: 'Bedsitter', image: 'https://via.placeholder.com/150x100?text=Bedsitter' },
      { type: 'One Bedroom', image: 'https://via.placeholder.com/150x100?text=1+Bedroom' },
      { type: 'Two Bedroom', image: 'https://via.placeholder.com/150x100?text=2+Bedroom' }
    ],
    verified: true
  },
  {
    _id: '4',
    name: 'Students Corner',
    description: 'Affordable and convenient hostel. Close to shopping center and main campus.',
    location: 'Chuka Business District',
    distance: '0.8 km from campus',
    phoneNumber: '+254745678901',
    caretaker: 'Mrs. Faith Wambui',
    caretakerPhone: '0745678901',
    amenities: ['WiFi', 'Hot Shower', 'Secure Parking', 'Water Tank'],
    image: 'https://via.placeholder.com/400x250?text=Students+Corner',
    roomTypes: [
      { type: 'Single Room', image: 'https://via.placeholder.com/150x100?text=Single+Room' },
      { type: 'Bedsitter', image: 'https://via.placeholder.com/150x100?text=Bedsitter' }
    ],
    verified: true
  },
  {
    _id: '5',
    name: 'Chuka Plaza Hostel',
    description: 'Modern hostel with good ventilation and spacious rooms. Central location.',
    location: 'Plaza Area, Chuka',
    distance: '1.2 km from campus',
    phoneNumber: '+254756789012',
    caretaker: 'Mr. Samuel Ochieng',
    caretakerPhone: '0756789012',
    amenities: ['WiFi', 'Hot Water', 'Gym', 'Study Hall', 'Canteen'],
    image: 'https://via.placeholder.com/400x250?text=Chuka+Plaza+Hostel',
    roomTypes: [
      { type: 'Single Room', image: 'https://via.placeholder.com/150x100?text=Single+Room' },
      { type: 'Bedsitter', image: 'https://via.placeholder.com/150x100?text=Bedsitter' },
      { type: 'One Bedroom', image: 'https://via.placeholder.com/150x100?text=1+Bedroom' }
    ],
    verified: true
  },
  {
    _id: '6',
    name: 'Home Away Hostel',
    description: 'Cozy hostel with family-like atmosphere. Ideal for students seeking comfort.',
    location: 'University Road',
    distance: '0.7 km from campus',
    phoneNumber: '+254767890123',
    caretaker: 'Ms. Catherine Kipchoge',
    caretakerPhone: '0767890123',
    amenities: ['WiFi', 'Hot Water', 'Laundry', 'Common Room', 'Garden'],
    image: 'https://via.placeholder.com/400x250?text=Home+Away+Hostel',
    roomTypes: [
      { type: 'Single Room', image: 'https://via.placeholder.com/150x100?text=Single+Room' },
      { type: 'Bedsitter', image: 'https://via.placeholder.com/150x100?text=Bedsitter' },
      { type: 'One Bedroom', image: 'https://via.placeholder.com/150x100?text=1+Bedroom' }
    ],
    verified: true
  }
];

exports.getAllHostels = async (req, res) => {
  try {
    // If optional auth attached a user, enforce subscription unless admin
    const user = req.user;

    if (user) {
      // Admin bypass
      if (user.isAdmin) {
        return res.json(mockHostels);
      }

      // Subscribed users allowed
      if (user.isSubscribed) {
        return res.json(mockHostels);
      }

      // Not subscribed - send message for UI to redirect to payment
      // But still return empty list to allow component to render subscription prompt
      return res.status(402).json({ 
        message: 'Subscription required to access hostels',
        hostels: []
      });
    }

    // No user attached: require subscription
    return res.status(402).json({ 
      message: 'Subscription required to access hostels',
      hostels: []
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Bulk import hostels (admin only) - expects { hostels: [ ... ] }
exports.importHostels = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { hostels: incoming } = req.body;
    if (!Array.isArray(incoming) || incoming.length === 0) {
      return res.status(400).json({ message: 'No hostels provided' });
    }

    const added = [];
    incoming.forEach(h => {
      const id = Date.now().toString() + Math.floor(Math.random() * 1000);
      const hostel = {
        _id: id,
        name: h.name || 'Unnamed Hostel',
        description: h.description || '',
        location: h.location || '',
        distance: h.distance || '',
        phoneNumber: h.phoneNumber || '',
        caretaker: h.caretaker || '',
        caretakerPhone: h.caretakerPhone || '',
        amenities: Array.isArray(h.amenities) ? h.amenities : (h.amenities ? String(h.amenities).split(',').map(a=>a.trim()) : []),
        image: h.image || `https://via.placeholder.com/400x250?text=${encodeURIComponent(h.name || 'Hostel')}`,
        roomTypes: Array.isArray(h.roomTypes) ? h.roomTypes : (h.roomTypes ? String(h.roomTypes).split(',').map(r=>({ type: r.trim(), image: `https://via.placeholder.com/150x100?text=${encodeURIComponent(r.trim())}` })) : []),
        verified: !!h.verified
      };
      // push into in-memory mockHostels
      mockHostels.push(hostel);
      added.push(hostel);
    });

    res.json({ message: `Imported ${added.length} hostels`, added });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getHostelById = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id).populate('owner', 'firstName lastName email phoneNumber');
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    res.json(hostel);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createHostel = async (req, res) => {
  try {
    const { name, description, location, distance, phoneNumber, email, roomTypes, amenities } = req.body;

    const hostel = new Hostel({
      name,
      description,
      location,
      distance,
      phoneNumber,
      email,
      roomTypes,
      amenities,
      owner: req.user.id
    });

    await hostel.save();
    res.status(201).json({ message: 'Hostel created successfully', hostel });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateHostel = async (req, res) => {
  try {
    let hostel = await Hostel.findById(req.params.id);
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    // Check ownership
    if (hostel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    hostel = await Hostel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Hostel updated successfully', hostel });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    const review = {
      userId: req.user.id,
      userName: `${req.user.firstName} ${req.user.lastName}`,
      rating,
      comment
    };

    hostel.reviews.push(review);
    await hostel.save();

    res.json({ message: 'Review added successfully', hostel });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Update hostel image (admin only) - upload to Cloudinary
exports.updateHostelImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl, imageBase64 } = req.body;

    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    if (!imageUrl && !imageBase64) {
      return res.status(400).json({ message: 'No image provided' });
    }

    // Find in mock data
    const hostel = mockHostels.find(h => h._id === id);
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    let uploadResult;

    // If base64 image, convert and upload
    if (imageBase64) {
      try {
        // Convert base64 to buffer
        const buffer = Buffer.from(imageBase64.split(',')[1] || imageBase64, 'base64');
        uploadResult = await uploadImage(buffer, `${hostel.name.replace(/\s+/g, '-')}-${Date.now()}`);
        hostel.image = uploadResult.secure_url;
      } catch (uploadErr) {
        console.error('Cloudinary upload error:', uploadErr);
        // Fallback to base64 if Cloudinary fails
        hostel.image = imageBase64;
      }
    } else if (imageUrl) {
      // If URL provided, fetch and upload to Cloudinary
      try {
        uploadResult = await uploadFromUrl(imageUrl, hostel.name.replace(/\s+/g, '-'));
        hostel.image = uploadResult.secure_url;
      } catch (uploadErr) {
        console.error('Cloudinary upload from URL error:', uploadErr);
        // Fallback to direct URL if Cloudinary fails
        hostel.image = imageUrl;
      }
    }

    res.json({ 
      message: 'Hostel image updated successfully', 
      hostel,
      imageUrl: hostel.image
    });
  } catch (error) {
    console.error('Update image error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};