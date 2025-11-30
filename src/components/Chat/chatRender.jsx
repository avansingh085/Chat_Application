import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import apiClient from '../../utils/apiClient';
import axios from 'axios';
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
  const handleJoinLinkClick = async (e) => {
    e.preventDefault();
    try {
      let joinLink = e.currentTarget.value;
     
      joinLink = joinLink.replace("http://localhost:3001", import.meta.env.VITE_BACKEND_URL);
      
      let result = await apiClient.post(joinLink, { id: User.userId });
     
      window.location = '/chat'
      if (result.data.success) {
        console.log("Join link result:", result.data);
      }
    } catch (err) {
      console.log("Error joining link:", err);
    }
  };

  return (
    <div
      ref={chatContainerRef}
      className="z-0 h-4/5 w-full -mb-7 bg-[url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')] bg-cover bg-center overflow-y-auto p-4"
    >
      {Chat[ConversationId]?.Message?.map((message) => (
        <div
          key={message._id}
          className={`flex mb-4 ${message.sender === User?.userId ? 'justify-end' : 'justify-start'
            }`}
        >
          <div
            className={`max-w-[70%] rounded-lg p-3 ${message.isExplicit ? 'bg-red-500 opacity-' : ''} ${!message.isExplicit && message.sender === User?.userId
              ? 'bg-green-200 text-black'
              : 'bg-gray-200 text-black'
              }`}
          >
            <div className={message.sender === User?.userId ? 'text-pink-700' : 'text-green-700'}>~{message.sender}</div>
            {message?.imageUrl ? (() => {
              const fileUrl = message.imageUrl;
              const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileUrl);
              const isPDF = /\.pdf$/i.test(fileUrl);

              return isImage ? (
                <img
                  src={fileUrl}
                  alt="Chat image"
                  className="-z-1 max-w-full rounded-lg"
                />
              ) : (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    {isPDF ? 'Open PDF' : 'Open File'}
                  </button>
                </a>
              );
            })() : (
              (() => {
                const joinLinkRegex = /http:\/\/localhost:3001\/api\/group\/[a-zA-Z0-9-]+\/[a-zA-Z0-9]+\/joinLink/g;
                const genericLinkRegex = /(https?:\/\/[^\s]+)/g;

                const parts = [];
                let lastIndex = 0;

                for (const match of message.message.matchAll(joinLinkRegex)) {
                  const matchStart = match.index;
                  const matchEnd = match.index + match[0].length;

                  if (matchStart > lastIndex) {
                    const textBetween = message.message.substring(lastIndex, matchStart);

                    const subParts = textBetween.split(genericLinkRegex).map((subPart) => {
                      if (genericLinkRegex.test(subPart) && !joinLinkRegex.test(subPart)) {
                        return { type: 'link', url: subPart };
                      }
                      return subPart;
                    });

                    parts.push(...subParts);
                  }

                  parts.push({ type: 'joinLink', url: match[0] });
                  lastIndex = matchEnd;
                }


                if (lastIndex < message.message.length) {
                  const rest = message.message.substring(lastIndex);
                  const restParts = rest.split(genericLinkRegex).map((subPart) => {
                    if (genericLinkRegex.test(subPart) && !joinLinkRegex.test(subPart)) {
                      return { type: 'link', url: subPart };
                    }
                    return subPart;
                  });

                  parts.push(...restParts);
                }

                return (
                  <p className="-z-2 flex flex-wrap items-center gap-2">
                    {parts.map((part, index) => {
                      if (typeof part === 'string') {
                        return <span key={index}>{part}</span>;
                      } else if (part.type === 'joinLink') {
                        return (

                          <button className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition" value={part.url} key={index} onClick={handleJoinLinkClick}>
                            Join Group
                          </button>

                        );
                      } else if (part.type === 'link') {
                        return (
                          <a
                            key={index}
                            href={part.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            {part.url}
                          </a>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </p>
                );
              })()
            )}




            <div
              className={`text-xs -z-50 mt-1 block ${message.sender === User?.userId ? 'text-black' : 'text-gray-600'
                }`}
            >
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatRender;