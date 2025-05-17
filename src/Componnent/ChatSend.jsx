import { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import apiClient from "../utils/apiClient";
import { setChat } from "../Redux/userSlice";

function ChatSend({ socket }) {
    console.log(socket,"connection")
    const [message, setMessage] = useState("");
    const [uploadImageUrl, setUploadImageUrl] = useState(null);
    const { User, Chat, ConversationId } = useSelector((state) => state.Chat);
    const dispatch = useDispatch();

    const [error, setError] = useState(null);
    const textareaRef = useRef(null);
    //image upload
    console.log("uploadImageUrl", uploadImageUrl);
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
       
        if (file) {
            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await apiClient.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                console.log(response.data)
                if (response.data.success) {
                    setUploadImageUrl(response.data.imageUrl);

                }
            } catch (err) {
                console.log(err)
                setError('Failed to upload image');
            }
        }
    };




    useEffect(() => {
        if (!socket) return;

        const handleMessage = (mes) => {
            console.log("New message received:", mes);
            const updatedChat = [...(Chat[mes.conversationId]?.Message || []), mes];

            dispatch(
                setChat({
                    ...Chat,
                    [mes.conversationId]: {
                        ...Chat[mes.conversationId],
                        Message: updatedChat,
                    },
                })
            );
        };

        const handleConnectError = (err) => {
            console.error("Socket connection error:", err);
        };

        socket.on("message", handleMessage);
        socket.on("connect_error", handleConnectError);

        return () => {
            socket.off("message", handleMessage);
            socket.off("connect_error", handleConnectError);
        };

    }, [socket, Chat, ConversationId, dispatch]);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px`;
        }
    }, [message]);

    const sendMessage = () => {
        console.log(socket,ConversationId,message,uploadImageUrl)
        if ( !socket || !ConversationId ||!(message.trim()||uploadImageUrl)) return;

        const newMessage = {
            sender: User.userId,
            message: message.trim(),
            conversationId: ConversationId,
            timestamp: new Date().toISOString(),
            imageUrl: uploadImageUrl ,
        };
console.log(newMessage,"HELLOW")
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
            setUploadImageUrl(null); 
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    };

    return (
        <div className="h-24 sticky bottom-0  w-full flex items-center border-t-2 bg-white px-4 shadow-sm" >

            {uploadImageUrl && (
                <div className="mb-4 flex items-center gap-4">
                    <img
                        src={uploadImageUrl}
                        className="h-12 w-12 rounded-full border shadow"
                        alt="Uploaded"
                    />
                </div>
            )}
            <label className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg
                    className="h-8 w-8 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
                </svg>

                <input
    type="file"
    accept="*/*"
    onChange={handleImageUpload}
    className="hidden"
/>
            </label>



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

            <button
                onClick={sendMessage}
                disabled={
                    !ConversationId || (!message.trim() && !uploadImageUrl)
                }
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