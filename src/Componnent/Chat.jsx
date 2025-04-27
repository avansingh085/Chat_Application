import ChatHeader from "./ChatHeader";
import ChatSend from './ChatSend';
import ChatRender from './ChatRender';
import { useSelector } from "react-redux";
function Chat({socket}) {
    const {layout} = useSelector((state) => state.Chat);
    //screen size change
   
    if(layout === "contacts")
        return null;
    return (
        <div className="w-fit  max-h-screen min-h-screen border-x-2 bg-white">
            <ChatHeader />
            <ChatRender socket={socket}/>
            <ChatSend socket={socket}/>
        </div>
    );
}

export default Chat;
