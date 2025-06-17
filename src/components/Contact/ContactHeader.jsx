import { useState } from 'react';
import CreateNewContact from './createNewContact';
import { useSelector } from 'react-redux';

function ContactHeader() {
    const [showCreateContact, setShowCreateContact] = useState(false);
     

    return (
        <div className="w-full border-y-2 bg-white shadow-sm">

            <div className="h-20 flex items-center justify-between px-4 md:px-8 lg:px-16">

                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">Chats</h1>

                <div className="flex items-center space-x-4">

                    <button
                        onClick={() => setShowCreateContact((prev) => !prev)}
                        title="New Chat"
                        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <svg
                            className="h-10 w-10 md:h-12 md:w-12 text-gray-600 hover:text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                    </button>


                </div>
            </div>

            <div className="h-16 flex items-center justify-center px-4">
                <div className="flex items-center w-full md:w-3/4 lg:w-1/2 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                    <svg
                        className="h-8 w-8 text-gray-500 p-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                    <input
                        className="w-full h-11 outline-none text-base md:text-lg px-2 bg-transparent placeholder-gray-500"
                        placeholder="Search chats..."
                    />
                </div>
            </div>

            {/* Conditional Render for CreateNewContact */}
            {showCreateContact && (
                <CreateNewContact setShowCreateContact={setShowCreateContact} />
            )}
        </div>
    );
}

export default ContactHeader;