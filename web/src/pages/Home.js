import React, { useEffect, useState } from 'react';
import { hostelService } from '../services/api';
import '../styles/Home.css';

const Home = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const isSubscribed = user?.isSubscribed;

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      const response = await hostelService.getAllHostels();
      setHostels(response.data || response.data?.hostels || []);
    } catch (err) {
      console.error('Error fetching hostels:', err);
      // If 402 (subscription required), show subscription prompt instead of error
      if (err.response?.status === 402) {
        // User will see subscription prompt from the component logic
        setHostels([]);
      } else {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to load hostels';
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isSubscribed) {
    return (
      <div className="subscription-prompt">
        <div className="subscription-card">
          <h2>🔒 Unlock SMARTSTAY CHUKA</h2>
          <p>Subscribe to view all hostels and their information</p>
          <p className="price">KES 263 for 30 days</p>
          <a href="/payment" className="btn btn-primary">Subscribe Now</a>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>🏠 Find Your Perfect Hostel</h1>
        <p className="subtitle">Welcome to Chuka University Hostel Directory</p>
      </div>
      
      {loading && (
        <div className="loading">
          <p>Loading hostels near Chuka University...</p>
        </div>
      )}
      
      {error && <p className="error-message">{error}</p>}
      
      <div className="hostels-grid">
        {hostels.map(hostel => (
          <div key={hostel._id} className="hostel-card">
            <div className="hostel-image-container">
              <img 
                src={hostel.image || 'https://via.placeholder.com/300x200?text=Hostel'} 
                alt={hostel.name}
                className="hostel-image"
              />
              <div className="hostel-distance">{hostel.distance}</div>
            </div>
            
            <div className="hostel-content">
              <h3>{hostel.name}</h3>
              
              <p className="hostel-description">{hostel.description}</p>
              
              <div className="hostel-info">
                <div className="info-item">
                  <span className="info-icon">📍</span>
                  <span>{hostel.location}</span>
                </div>
                
                <div className="info-item">
                  <span className="info-icon">👨‍💼</span>
                  <div>
                    <strong>{hostel.caretaker}</strong>
                    <p>{hostel.caretakerPhone}</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <span className="info-icon">📱</span>
                  <a href={`tel:${hostel.phoneNumber}`}>{hostel.phoneNumber}</a>
                </div>
              </div>

              {hostel.roomTypes && hostel.roomTypes.length > 0 && (
                <div className="room-types">
                  <div className="room-types-title">🏠 Room Types Available:</div>
                  <div className="room-gallery">
                    {hostel.roomTypes.map((room, idx) => (
                      <div key={idx} className="room-item">
                        <img 
                          src={room.image} 
                          alt={room.type}
                          className="room-image"
                        />
                        <span className="room-label">{room.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="amenities">
                {hostel.amenities && hostel.amenities.map((amenity, idx) => (
                  <span key={idx} className="tag">{amenity}</span>
                ))}
              </div>
            </div>
            
            <div className="hostel-actions">
              <a href={`tel:${hostel.caretakerPhone}`} className="btn btn-call">
                📞 Call Caretaker
              </a>
              <a href={`tel:${hostel.phoneNumber}`} className="btn btn-secondary">
                📲 Call Hostel
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
