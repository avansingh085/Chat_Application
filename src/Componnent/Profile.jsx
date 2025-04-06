import { useState } from 'react';

const ProfilePopup = ({ isOpen, onClose, group,profileUser}) => {
  const currentUser = { id: 1, name: 'John Doe' };
  

  const [name, setName] = useState(profileUser?.userId);
  const [title, setTitle] = useState(profileUser?.status);
  const [image, setImage] = useState(profileUser?.profilePicture);
  
  const isSameUser = currentUser.id === profileUser?.userId;
  const joinLink = group ? `https://app.example.com/join/${groupId}` : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated profile:', { name, title, image });
    onClose();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(joinLink);
    alert('Link copied to clipboard!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative shadow-2xl transform transition-all duration-300 scale-95 hover:scale-100">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition-colors duration-200 text-2xl font-bold"
        >
          ×
        </button>

        {/* Profile content */}
        <div className="flex flex-col items-center">
          <div className="relative mb-6">
            <img
              src={image}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-md"
            />
            {isSameUser && (
              <label className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full p-2 cursor-pointer shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200">
                <span className="text-sm font-medium">Edit</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          {isSameUser ? (
            // Edit mode form
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800">
                  {isGroup ? 'Group Name' : 'Name'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800">
                  {isGroup ? 'Description' : 'Title'}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md"
              >
                Save Changes
              </button>
            </form>
          ) : (
            // View mode
            <div className="text-center space-y-4 w-full">
              <h2 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {name}
              </h2>
              <p className="text-gray-600 italic">{title}</p>

              {false && (
                <>
                  <p className="text-sm text-gray-500">
                    {profileUser?.members} members
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <input
                        type="text"
                        value={joinLink}
                        readOnly
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 bg-gray-50 text-sm"
                      />
                      <button
                        onClick={handleCopyLink}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-200"
                      >
                        Copy
                      </button>
                    </div>
                    <button className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-all duration-200">
                      Join Group
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Add some custom animations in your Tailwind config or CSS
const customStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }
`;

export default ProfilePopup;