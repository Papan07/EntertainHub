import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaCalendarAlt, FaEdit, FaSignOutAlt, FaHeart, FaList, FaStar, FaTimes } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const { user, logout, updateProfile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: ''
  });

  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing && user) {
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const result = await updateProfile(editForm);
    if (result.success) {
      setIsEditing(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <h2>Profile not found</h2>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Close Button */}
      <button className="profile-close-btn" onClick={handleClose} title="Go Back">
        ←
      </button>

      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              <span>{user.firstName?.[0] || user.username?.[0] || 'U'}</span>
            </div>
          </div>
          
          <div className="profile-info">
            <h1 className="profile-name">
              {user.firstName && user.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user.username
              }
            </h1>
            <p className="profile-username">@{user.username}</p>
            <p className="profile-join-date">
              <FaCalendarAlt />
              Member since {formatDate(user.createdAt)}
            </p>
          </div>

          <div className="profile-actions">
            <button 
              className="edit-profile-btn"
              onClick={handleEditToggle}
            >
              <FaEdit />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            
            <button 
              className="logout-btn"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          {/* User Details Section */}
          <div className="profile-section">
            <h2 className="section-title">
              <FaUser />
              Personal Information
            </h2>
            
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="edit-form">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={editForm.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={editForm.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="save-btn">
                    Save Changes
                  </button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={handleEditToggle}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="user-details">
                <div className="detail-item">
                  <span className="detail-label">
                    <FaEnvelope />
                    Email
                  </span>
                  <span className="detail-value">{user.email}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">
                    <FaUser />
                    First Name
                  </span>
                  <span className="detail-value">{user.firstName || 'Not provided'}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">
                    <FaUser />
                    Last Name
                  </span>
                  <span className="detail-value">{user.lastName || 'Not provided'}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">
                    <FaUser />
                    Username
                  </span>
                  <span className="detail-value">{user.username}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">
                    <FaCalendarAlt />
                    Account Created
                  </span>
                  <span className="detail-value">{formatDate(user.createdAt)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div className="profile-section">
            <h2 className="section-title">
              <FaStar />
              Activity Stats
            </h2>
            
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">
                  <FaHeart />
                </div>
                <div className="stat-info">
                  <span className="stat-number">{user.favorites?.length || 0}</span>
                  <span className="stat-label">Favorites</span>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <FaList />
                </div>
                <div className="stat-info">
                  <span className="stat-number">{user.watchlist?.length || 0}</span>
                  <span className="stat-label">Watchlist</span>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <FaStar />
                </div>
                <div className="stat-info">
                  <span className="stat-number">{user.reviews?.length || 0}</span>
                  <span className="stat-label">Reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
