import { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import { setChat } from "../Redux/globalSlice";

function ChatSend() {
    const [message, setMessage] = useState("");
    const [socket, setSocket] = useState(null);
    const { User, Chat, ConversationId } = useSelector((state) => state.Chat);
    const dispatch = useDispatch();
    const textareaRef = useRef(null);

    useEffect(() => {
        if (!User?.userId) return;

        const s = io("http://localhost:3001", {
            query: { userId: User.userId },
            transports: ["websocket"],
        });

        s.on("connect", () => {
            console.log("Connected to socket:", s.id);
        });

        s.on("message", (mes) => {
            console.log("New message received:", mes);
            const updatedChat = [...(Chat[ConversationId]?.Message || []), mes];
            dispatch(
                setChat({
                    ...Chat,
                    [ConversationId]: {
                        ...Chat[ConversationId],
                        Message: updatedChat,
                    },
                })
            );
        });

        s.on("connect_error", (err) => {
            console.error("Socket connection error:", err);
        });

        setSocket(s);

        return () => {
            s.off("connect");
            s.off("message");
            s.off("connect_error");
            s.disconnect();
        };
    }, [User?.userId]); 
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px`;
        }
    }, [message]);

    const sendMessage = () => {
        if (!message.trim() || !socket || !ConversationId) return;

        const newMessage = {
            sender: User.userId,
            message: message.trim(),
            conversationId: ConversationId,
            timestamp: new Date().toISOString(),
            isImage: false,
        };

        try {
            socket.emit("message", newMessage);
            const updatedChat = [...(Chat[ConversationId]?.Message || []), newMessage];
            dispatch(
                setChat({
                    ...Chat,
                    [ConversationId]: {
                        ...Chat[ConversationId],
                        Message: updatedChat,
                    },
                })
            );
            setMessage("");
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    };

    return (
        <div className="h-24 w-full flex items-center border-t-2 bg-white px-4 shadow-sm">
           
            <button
                title="Attach File"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
                <svg
                    className="h-8 w-8 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
                </svg>
            </button>

            <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 mx-4 min-h-12 max-h-24 w-full rounded-lg border-2 border-gray-300 px-3 py-2 text-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none overflow-auto"
                placeholder="Type a message..."
                onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                    }
                }}
            />

            {/* Send Button */}
            <button
                onClick={sendMessage}
                disabled={!message.trim() || !ConversationId}
                title="Send Message"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
                <svg
                    className="h-8 w-8 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
            </button>
        </div>
    );
}

export default ChatSend;