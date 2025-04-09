import ChatHeader from "./ChatHeader";
import ChatSend from './ChatSend';
import ChatRender from './ChatRender';
function Chat({socket}) {
    return (
        <div className="w-full md:w-8/12 h-full border-x-2 bg-white">
            <ChatHeader />
            <ChatRender socket={socket}/>
            <ChatSend socket={socket}/>
        </div>
    );
}

export default Chat;
