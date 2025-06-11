import React, { useState } from "react";
import { apiPost } from "../../utils/apiClient";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from "../../Redux/userSlice";
import { FaSpinner } from "react-icons/fa";

const CreateNewContact = ({ setShowCreateContact }) => {
  const [userId, setUserId] = useState("");
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { User } = useSelector((state) => state.Chat);
  const dispatch = useDispatch();

  const handleGroupSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;
    setLoading(true);
    try {
      await apiPost("/chat/conversation", {
        groupName,
        participants: [User.userId],
        type: "group",
      });
      dispatch(fetchUser());
      setGroupName("");
      setShowCreateContact(false);
    } catch (err) {
      setErrorMsg("Failed to create group. Please try again.");
      console.error("Group creation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!userId.trim()) return;
    setLoading(true);
    try {
      await apiPost("/chat/conversation", {
        participants: [User.userId, userId],
        type: "personal",
      });
      dispatch(fetchUser());
      setUserId("");
      setShowCreateContact(false);
    } catch (err) {
      setErrorMsg("Failed to create contact. Please try again.");
      console.error("Contact creation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-96 absolute top-20 left-1/2 transform -translate-x-1/2 bg-white border-2 border-gray-200 rounded-lg shadow-lg p-6 z-10 transition-all duration-300">
      <button
        onClick={() => setShowCreateContact(false)}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200"
        title="Close"
      >
        ✕
      </button>

      <div className="grid gap-6">
        {errorMsg && (
          <div className="text-red-600 font-medium text-sm">{errorMsg}</div>
        )}

        {/* Group creation */}
        <div className="grid gap-3">
          <h3 className="text-lg font-semibold text-gray-800">
            Create New Group
          </h3>
          <form onSubmit={handleGroupSubmit} className="grid gap-3">
            <input
              type="text"
              className="w-full h-12 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!groupName.trim() || loading}
              className="flex items-center justify-center gap-2 w-full h-12 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Creating...
                </>
              ) : (
                "Create Group"
              )}
            </button>
          </form>
        </div>

        {/* Contact creation */}
        <div className="grid gap-3">
          <h3 className="text-lg font-semibold text-gray-800">
            Create New Contact
          </h3>
          <form onSubmit={handleContactSubmit} className="grid gap-3">
            <input
              type="text"
              className="w-full h-12 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter contact ID"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!userId.trim() || loading}
              className="flex items-center justify-center gap-2 w-full h-12 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Creating...
                </>
              ) : (
                "Create Contact"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateNewContact;
