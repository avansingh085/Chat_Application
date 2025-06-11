import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../Redux/userSlice';
import apiClient from '../../utils/apiClient';

const ProfilePopup = ({ onClose, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { User } = useSelector((state) => state.Chat);
  const [formData, setFormData] = useState({
    email: '',
    profilePicture: '',
    status: '',
  });
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (User) {
      setFormData({
        email: User.email || '',
        profilePicture: User.profilePicture || '',
        status: User.status || '',
      });
    }
  }, [User]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', User.userId);
        const response = await apiClient.post('/upload/file', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
       await apiClient.post('/user/update-profile',{userId:User._id,status:User.status,profilePicture:response.data.url});
        if (response.data.success) {
         
          dispatch(setUser({ ...User, profilePicture: response.data.url }));

          handleInputChange('profilePicture', response.data.url);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const validateForm = () => {
    if (!formData.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      throw new Error('Please enter a valid email address');
    }
    if (formData.status.length > 100) {
      throw new Error('Status must be less than 100 characters');
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      validateForm();

      const res = await apiClient.post('/user/update-profile', {
        ...formData,
        userId: User.userId
      });

      if (res.data.success) {
        dispatch(setUser({ ...User, ...formData }))

        setIsEditing(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!User) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>

        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={formData.profilePicture || 'default-avatar.jpg'}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600 text-sm">
                  📷
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">@{User.userId}</h2>
              <p className="text-sm text-gray-500">
                Last seen {moment(User.lastSeen).fromNow()}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                />
              ) : (
                <p className="mt-1 text-gray-900">{formData.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              {isEditing ? (
                <textarea
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md"
                  rows="2"
                  maxLength="100"
                />
              ) : (
                <p className="mt-1 text-gray-900 italic">
                  {formData.status || "Hey there! I'm using ChatsApp"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contacts ({User.contacts?.length || 0})
              </label>
              <div className="mt-1 flex flex-wrap gap-2">
                {User.contacts?.map(contact => (
                  <span
                    key={contact}
                    className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    @{contact}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      email: User.email || '',
                      profilePicture: User.profilePicture || '',
                      status: User.status || '',
                    });
                  }}
                  className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Edit Profile
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
              </>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePopup;

