import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

function ChatRender() {
    const { ConversationId, Chat, User } = useSelector((state) => state.Chat);
    const chatContainerRef = useRef(null); 
    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            chatContainer.scrollTo({
                top: chatContainer.scrollHeight,
                behavior: 'smooth', 
            });
        }
    }, [Chat[ConversationId]?.Message]); 

    return (
        <div
            ref={chatContainerRef}
            className="z-0 h-4/5 w-full -mb-7 bg-[url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')] bg-cover bg-center overflow-y-auto p-4"
        >
            {Chat[ConversationId]?.Message?.map((message) => (
                <div
                    key={message._id}
                    className={`flex mb-4 ${
                        message.sender === User?.userId ? 'justify-end' : 'justify-start'
                    }`}
                >
                    <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                            message.sender === User?.userId
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-black'
                        }`}
                    >
                        {message.isImage ? (
                            <img
                                src={message.imageUrl}
                                alt="Chat image"
                                className="-z-1 max-w-full rounded-lg"
                            />
                        ) : (
                            <p className="-z-2">{message.message}</p>
                        )}
                        <span
                            className={`text-xs mt-1 block ${
                                message.sender === User?.userId ? 'text-blue-100' : 'text-gray-600'
                            }`}
                        >
                            {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ChatRender;