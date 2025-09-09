import React, { useState } from 'react';
import './Profile.css';

const Profile = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`http://localhost:8080/api/users/${user.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Profile updated successfully!');
        // Update localStorage with new user data
        const updatedUser = { ...user, ...data.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (error) {
      setError('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/users/${user.userId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Password changed successfully!');
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setError(data.message || 'Failed to change password');
      }
    } catch (error) {
      setError('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>👤 My Profile</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="profile-content">
        <div className="profile-info-section">
          <div className="card">
            <h2>Profile Information</h2>
            
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleProfileUpdate} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>

          <div className="card">
            <h2>Account Statistics</h2>
            <div className="account-stats">
              <div className="stat-item">
                <div className="stat-label">Member Since</div>
                <div className="stat-value">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">User ID</div>
                <div className="stat-value">#{user.userId}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Account Status</div>
                <div className="stat-value">
                  <span className="badge badge-success">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-security-section">
          <div className="card">
            <h2>Change Password</h2>
            <p className="text-muted">Keep your account secure by using a strong password</p>
            
            <form onSubmit={handlePasswordChange} className="password-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  className="form-control"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  className="form-control"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-control"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-secondary"
                disabled={loading}
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>

          <div className="card">
            <h2>Account Actions</h2>
            <div className="account-actions">
              <div className="action-item">
                <h4>Download Data</h4>
                <p>Download a copy of your travel data and bookings</p>
                <button className="btn btn-outline">Download Data</button>
              </div>
              <div className="action-item">
                <h4>Delete Account</h4>
                <p>Permanently delete your account and all associated data</p>
                <button className="btn btn-danger">Delete Account</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
