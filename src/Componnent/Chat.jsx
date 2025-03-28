import ChatHeader from "./ChatHeader";
import ChatSend from './ChatSend';
import ChatRender from './ChatRender';
function Chat() {
    return (
        <div className="w-full md:w-8/12 h-full border-x-2 bg-white">
            <ChatHeader />
            <ChatRender/>
            <ChatSend/>
        </div>
    );
}

export default Chat;
