import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <p className="text-gray-900">{user.email}</p>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Member Since</label>
          <p className="text-gray-900">
            {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;