import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImportForm, setShowImportForm] = useState(false);
  const [importText, setImportText] = useState('');
  const [importMsg, setImportMsg] = useState('');
  const [user] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    distance: '',
    phoneNumber: '',
    caretaker: '',
    caretakerPhone: '',
    image: '',
    amenities: '',
    roomTypes: ''
  });
  const [imagePreview, setImagePreview] = useState('');
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchHostels();
  }, [user, navigate]);

  const fetchHostels = async () => {
    try {
      setLoading(true);
      const response = await api.get('/hostels');
      setHostels(response.data);
    } catch (err) {
      console.error('Failed to fetch hostels:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Image size must be less than 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select an image file');
        return;
      }

      setUploadError('');
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        setImagePreview(base64);
        setFormData(prev => ({ ...prev, image: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddHostel = async (e) => {
    e.preventDefault();
    try {
      const amenitiesArray = formData.amenities.split(',').map(a => a.trim());
      const roomTypesArray = formData.roomTypes.split(',').map(r => ({
        type: r.trim(),
        image: 'https://via.placeholder.com/150x100?text=' + r.trim().replace(/\s+/g, '+')
      }));

      const newHostel = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        distance: formData.distance,
        phoneNumber: formData.phoneNumber,
        caretaker: formData.caretaker,
        caretakerPhone: formData.caretakerPhone,
        image: formData.image || 'https://via.placeholder.com/400x250?text=' + formData.name.replace(/\s+/g, '+'),
        amenities: amenitiesArray,
        roomTypes: roomTypesArray,
        verified: true
      };

      await api.post('/hostels', newHostel);
      
      // Reset form
      setFormData({
        name: '', description: '', location: '', distance: '',
        phoneNumber: '', caretaker: '', caretakerPhone: '',
        image: '', amenities: '', roomTypes: ''
      });
      setImagePreview('');
      setShowAddForm(false);
      fetchHostels();
    } catch (err) {
      console.error('Failed to add hostel:', err);
    }
  };

  const handleDeleteHostel = async (id) => {
    if (window.confirm('Are you sure you want to delete this hostel?')) {
      try {
        await api.delete(`/hostels/${id}`);
        fetchHostels();
      } catch (err) {
        console.error('Failed to delete hostel:', err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  if (loading) return <div className="admin-container"><p>Loading...</p></div>;

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-title">
          <h1>🏢 SMARTSTAY CHUKA - Admin Dashboard</h1>
          <p>Welcome, {user?.firstName || 'Admin'}!</p>
        </div>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </header>

      <div className="admin-content">
        <div className="admin-sidebar">
          <button 
            className={`btn-action ${showAddForm ? 'active' : ''}`}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            ➕ Add New Hostel
          </button>
          <button 
            className={`btn-action ${showImportForm ? 'active' : ''}`}
            onClick={() => {
              setShowImportForm(!showImportForm);
              setImportMsg('');
            }}
          >
            📥 Import Hostels
          </button>
          <p className="hostel-count">Total Hostels: {hostels.length}</p>
        </div>

        <div className="admin-main">
          {showAddForm && (
            <div className="add-hostel-form">
              <h2>Add New Hostel</h2>
              <form onSubmit={handleAddHostel}>
                <input
                  type="text"
                  name="name"
                  placeholder="Hostel Name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Location (e.g., Near Main Gate)"
                  value={formData.location}
                  onChange={handleFormChange}
                  required
                />
                <input
                  type="text"
                  name="distance"
                  placeholder="Distance (e.g., 0.5 km from campus)"
                  value={formData.distance}
                  onChange={handleFormChange}
                  required
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Hostel Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleFormChange}
                  required
                />
                <input
                  type="text"
                  name="caretaker"
                  placeholder="Caretaker Name"
                  value={formData.caretaker}
                  onChange={handleFormChange}
                  required
                />
                <input
                  type="tel"
                  name="caretakerPhone"
                  placeholder="Caretaker Phone Number"
                  value={formData.caretakerPhone}
                  onChange={handleFormChange}
                  required
                />
                <div className="image-upload-section">
                  <label htmlFor="image-upload" className="image-upload-label">
                    📸 Upload Hostel Picture
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="image-upload-input"
                  />
                  {uploadError && <p className="error-message">{uploadError}</p>}
                  {imagePreview && (
                    <div className="image-preview">
                      <p>Preview:</p>
                      <img src={imagePreview} alt="Preview" className="preview-img" />
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  name="amenities"
                  placeholder="Amenities (comma-separated, e.g., WiFi, Hot Water, Security)"
                  value={formData.amenities}
                  onChange={handleFormChange}
                  required
                />
                <input
                  type="text"
                  name="roomTypes"
                  placeholder="Room Types (comma-separated, e.g., Single Room, Bedsitter, One Bedroom)"
                  value={formData.roomTypes}
                  onChange={handleFormChange}
                  required
                />
                <div className="form-buttons">
                  <button type="submit" className="btn-submit">Save Hostel</button>
                  <button type="button" className="btn-cancel" onClick={() => {
                    setShowAddForm(false);
                    setImagePreview('');
                  }}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {showImportForm && (
            <div className="import-hostels-form">
              <h2>Import Hostels (JSON Array)</h2>
              <p>Paste a JSON array of hostels. Example: name, description, location, distance, phoneNumber, caretaker, caretakerPhone, amenities, roomTypes</p>
              <textarea value={importText} onChange={(e) => setImportText(e.target.value)} rows={10} />
              <div className="form-buttons">
                <button className="btn-submit" onClick={async () => {
                  setImportMsg('');
                  try {
                    const parsed = JSON.parse(importText);
                    if (!Array.isArray(parsed)) throw new Error('JSON must be an array');
                    await api.post('/hostels/import', { hostels: parsed });
                    setImportMsg('Import successful');
                    setImportText('');
                    fetchHostels();
                  } catch (err) {
                    setImportMsg('Import failed: ' + (err.message || err.response?.data?.message || 'Invalid JSON'));
                  }
                }}>Import</button>
                <button className="btn-cancel" onClick={() => {
                  setShowImportForm(false);
                  setImportText('');
                  setImportMsg('');
                }}>Close</button>
              </div>
              {importMsg && <p className="import-msg">{importMsg}</p>}
            </div>
          )}

          <div className="hostels-list">
            <h2>All Hostels ({hostels.length})</h2>
            {hostels.length === 0 ? (
              <p className="no-hostels">No hostels yet. Add your first hostel!</p>
            ) : (
              <div className="admin-hostels-grid">
                {hostels.map(hostel => (
                  <div key={hostel._id} className="admin-hostel-card">
                    <div className="card-image">
                      <img src={hostel.image} alt={hostel.name} />
                    </div>
                    <div className="card-content">
                      <h3>{hostel.name}</h3>
                      <p className="description">{hostel.description}</p>
                      
                      <div className="info-group">
                        <p><strong>📍 Location:</strong> {hostel.location}</p>
                        <p><strong>📏 Distance:</strong> {hostel.distance}</p>
                      </div>

                      <div className="contact-group">
                        <p><strong>👨‍💼 Caretaker:</strong> {hostel.caretaker}</p>
                        <p><strong>📱 Caretaker:</strong> {hostel.caretakerPhone}</p>
                        <p><strong>📞 Hostel:</strong> {hostel.phoneNumber}</p>
                      </div>

                      <div className="amenities-group">
                        <strong>🏥 Amenities:</strong>
                        <div className="amenities-list">
                          {hostel.amenities && hostel.amenities.map((amenity, idx) => (
                            <span key={idx} className="amenity-badge">{amenity}</span>
                          ))}
                        </div>
                      </div>

                      <div className="rooms-group">
                        <strong>🏠 Room Types:</strong>
                        <div className="rooms-list">
                          {hostel.roomTypes && hostel.roomTypes.map((room, idx) => (
                            <div key={idx} className="room-item">
                              <img src={room.image} alt={room.type} />
                              <span>{room.type}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="card-actions">
                        <button className="btn-delete" onClick={() => handleDeleteHostel(hostel._id)}>🗑️ Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
