import React, { useState } from "react";
import { apiPost } from "../../utils/apiClient";
import { useSelector } from "react-redux";

const CreateNewContact = ({ setShowCreateContact }) => {
    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("");
    const [groupName, setGroupName] = useState("");
    const { User } = useSelector((state) => state.Chat);

    const createNewGroup = (e) => {
        e.preventDefault();
        if (groupName.trim().length > 0) {
            apiPost("/chat/conversation", {
                groupName,
                participants: [User.userId],
                type: "group",
            }).then(() => {
                setGroupName("");
                setShowCreateContact(false);
            }).catch((err) => console.error("Error creating group:", err));
        }
    };

    const createNewContact = (e) => {
        e.preventDefault();
        if (userId.trim().length > 0) {
            apiPost("/chat/conversation", {
                participants: [User.userId, userId],
                type: "personal",
            }).then(() => {
                setUserId("");
                setUserName("");
                setShowCreateContact(false);
            }).catch((err) => console.error("Error creating contact:", err));
        }
    };

    return (
        <div className="w-96 absolute top-20 left-1/2 transform -translate-x-1/2 bg-white border-2 border-gray-200 rounded-lg shadow-lg p-6 z-10 transition-all duration-300">

            <button
                onClick={() => setShowCreateContact(false)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200"
                title="Close"
            >
                <svg
                    className="h-6 w-6 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
            </button>

            <div className="grid gap-6">

                <div className="grid gap-3">
                    <h3 className="text-lg font-semibold text-gray-800">Create New Group</h3>
                    <form onSubmit={createNewGroup} className="grid gap-3">
                        <input
                            type="text"
                            className="w-full h-12 px-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="Enter group name"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full h-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                            disabled={!groupName.trim()}
                        >
                            Create Group
                        </button>
                    </form>
                </div>

                <div className="grid gap-3">
                    <h3 className="text-lg font-semibold text-gray-800">Create New Contact</h3>
                    <form onSubmit={createNewContact} className="grid gap-3">
                        <input
                            type="text"
                            className="w-full h-12 px-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="Enter contact ID"
                            required
                        />
                        {/* <input
                            type="text"
                            className="w-full h-12 px-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Enter name"
                            required
                        /> */}
                        <button
                            type="submit"
                            className="w-full h-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                            disabled={!userId.trim()}
                        >
                            Create Contact
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateNewContact;