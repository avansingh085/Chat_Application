import { useState } from 'react';
import { useSelector } from 'react-redux';
import apiClient from '../../utils/apiClient';

const ProfilePopup = ({ isOpen, onClose, isGroup, profileUser }) => {
  const currentUser = { id: 1, name: 'John Doe' }; 
  const { User, Chat, ConversationId } = useSelector((state) => state.Chat);
  const [name, setName] = useState(profileUser?.userId || '');
  const [title, setTitle] = useState(profileUser?.status || '');
  const [image, setImage] = useState(profileUser?.profilePicture || '');
  const [joinLink, setJoinLink] = useState(null);
  const [newMember, setNewMember] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isSameUser = currentUser.id === profileUser?.userId;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated profile:', { name, title, image });
    setSuccess('Profile updated successfully!');
    setTimeout(() => {
      setSuccess('');
      onClose();
    }, 1500);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const generateLink = async () => {
    if (!isGroup) return;
    setIsLoading(true);
    setError('');
    try {
      const result = await apiClient.get(`/group/${ConversationId}/link`);
      if (result.data.success) {
        setJoinLink(result.data.joinLink);
        setSuccess('Link generated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.data.message || 'Failed to generate link');
      }
    } catch (err) {
      setError('Error generating link. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(joinLink);
    setSuccess('Link copied to clipboard!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const addNewPerson = async () => {
    if (!newMember.trim()) {
      setError('Please enter a valid username or email');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await apiClient.post(`/group/add/${ConversationId}`, {
        newUser: newMember.trim()
      });

      if (res.data.success) {
        setSuccess(`${newMember} added successfully!`);
        setNewMember('');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(res.data.message || 'Failed to add member');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding member. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative transform transition-all animate-slide-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close popup"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {isGroup ? (
          <div className="text-center">
            <img
              src={Chat[ConversationId]?.Group?.groupPicture || '/default-group.png'}
              alt="Group"
              className="w-20 h-20 rounded-full mx-auto border-4 border-blue-100 shadow-md object-cover"
            />
            <h2 className="text-2xl font-semibold text-gray-800 mt-4">
              {Chat[ConversationId]?.Group?.groupName || 'Group Name'}
            </h2>
            <p className="text-gray-500 mt-1">Group Chat</p>

            <div className="mt-6 space-y-4">
              <button
                onClick={generateLink}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center justify-center"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                    />
                  </svg>
                ) : null}
                {isLoading ? 'Generating...' : 'Create Group Join Link'}
              </button>

              {joinLink && (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={joinLink}
                    readOnly
                    className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    title="Copy link"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              )}

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  placeholder="Enter username or email"
                  className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addNewPerson}
                  disabled={isLoading}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <img
              src={image || '/default-user.png'}
              alt="Profile"
              className="w-20 h-20 rounded-full mx-auto border-4 border-blue-100 shadow-md object-cover"
            />
            {isSameUser ? (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                    placeholder="Your status"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-gray-800 mt-4">{name}</h2>
                <p className="text-gray-500 mt-1">{title || 'No status'}</p>
              </>
            )}
          </div>
        )}

        {/* Feedback Messages */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm animate-fade-in">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm animate-fade-in">
            {success}
          </div>
        )}
      </div>
    </div>
  );
};

// Tailwind CSS custom animations
const customStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }
  .animate-slide-up {
    animation: slideUp 0.3s ease-in-out;
  }
`;

export default ProfilePopup;