import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Profile from '../User/Profile';
import VideoCall from '../VideoCall';
import { Error, Success } from '../Common/toast';
import Ringtone from '../RingTon';
function ChatHeader({socket=null}) {

    const { ConversationId, Chat, ContactData, User } = useSelector((state) => state.Chat);

    const [showProfile, setShowProfile] = useState(false);

    const [contactUserId, setContactUserId] = useState("");

    const [isVideoCall, setIsVideoCall] = useState(false);

    const [isInComming,setIsInComming]=useState(false);

    const [conId,setConId]=useState('');
   

    useEffect(()=>{
        if(!socket)
        {
           // Error('Socket not connected!')
            return;
        }
        socket.on('offer-video-call',({roomId,userName})=>{
           
            console.log('offer-video-call received',roomId,userName);
           setIsInComming(true);
               setConId(roomId);
               setIsVideoCall(true);
        })

        socket.on('end-video-call',({roomId,userName})=>{
            console.log('end-video-call received',roomId,userName);
            setIsVideoCall(false);
            setConId('');
            setIsInComming(false);
            
        })

        // return ()=>{
        //     socket.off('end-video-call');
        //     socket.off('offer-video-call');
        // }

    },[socket])


    function sendVideoCallRequest(){
        if(!socket)
        {
        return;
        }
        try{
        setConId(ConversationId);
        setIsVideoCall(true);
        console.log('emitting offer-video-call',{roomId:ConversationId,userName:User.userId});
        socket.emit('offer-video-call',{roomId:ConversationId,userName:User.userId})
        }
        catch(err){
            console.log(err,"Error in sending video call request");
        }

    }
    


    useEffect(() => {
        if (!Chat)
            return;
        let userId = User?.userId;

        if (Chat[ConversationId]?.Conversation?.type !== "group") {

            if (Chat[ConversationId]?.Conversation?.participants[1] === userId) {
                setContactUserId(Chat[ConversationId]?.Conversation?.participants[0])
            }
            else {
                setContactUserId(Chat[ConversationId]?.Conversation?.participants[1])
            }
        }

    }, [Chat, ConversationId])

     if(!socket||!socket.connected)
    {
        return (<div className="h-20 w-full border-y-2 bg-white flex items-center justify-between px-4 shadow-sm"></div>);
    }

    return (
        <div className="h-fit w-full border-y-2 bg-white flex items-center justify-between px-4 shadow-sm">

            <div className=" grid text-sm md:text-lg mt-3 md:flex items-center md:space-x-2 space-y-3">
                <img
                    className="h-14 w-14 rounded-full border-2 border-gray-300"
                    src={ContactData[contactUserId]?.profilePicture || '/profile.jpeg'}

                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/profile.jpeg';
                    }}

                    alt="User Avatar"
                    onClick={() => { setShowProfile(!showProfile) }}
                />
               
                {
                    showProfile && <Profile onClose={() => { setShowProfile(false) }} isOpen={showProfile} isGroup={(Chat[ConversationId]?.Conversation?.type === "group")} profileUser={ContactData[contactUserId]} />
                }
                <div className="flex flex-col pb-3">
                    {
                        Chat[ConversationId]?.Conversation?.type === "group" ? <span className="text-xl font-semibold text-gray-800">{String(Chat[ConversationId]?.Group?.groupName || '').slice(0, 10)}</span> :
                            <span className="text-xl font-semibold text-gray-800">{String(contactUserId || '').slice(0, 10)}</span>
                    }

                </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
                {/* Video Call Button */}
                <button
                    title="Video Call"
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                    onClick={() => { setIsVideoCall(!isVideoCall);sendVideoCallRequest(); }}
                >
                    <svg
                        className="h-8 w-8 text-gray-600 hover:text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                    </svg>
                </button>
                {
                    isVideoCall && conId && <VideoCall isInComming={isInComming} initialRoomId={conId} setIsInComming={setIsInComming} userName={User.userId} onClose={() => { if(socket){socket.emit('end-video-call',{roomId:conId,userName:User?.userId})} setIsVideoCall(false) }} isOpen={isVideoCall} roomId={conId}   />
                }
                <Ringtone isRing={isInComming}/>

                <button
                    title="Voice Call"
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                    <svg
                        className="h-8 w-8 text-gray-600 hover:text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                </button>

                {/* More Options Button */}
                <button
                    title="More Options"
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                    <svg
                        className="h-8 w-8 text-gray-600 hover:text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default ChatHeader;