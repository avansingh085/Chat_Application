import ChatHeader from "../components/Chat/chatHeader";
import ChatSend from '../components/Chat/chatSend';
import ChatRender from '../components/Chat/chatRender';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
function Chat({ socket }) {
    const { layout } = useSelector((state) => state.Chat);
   

    if (layout === "contacts")
        return null;
    return (
        <div className="w-full h-full overflow-hidden border-x-2 bg-white">
            <ChatHeader />
            <ChatRender socket={socket} />
            <ChatSend socket={socket} />
        </div>
    );
}

export default Chat;
