import React, { useEffect,useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { setConversationId, setCurrChat } from '../../Redux/userSlice';
import { setLayout } from '../../Redux/userSlice';
function ContactBox({data:ConversationId,socket,search}) {
    const {Chat,User,ContactData ,Notifications,layout}=useSelector((state)=>state.Chat)
    
    const [contactUserId,setContactUserId]=useState("");
    const [NotificationKey,setNotificationKey]=useState("");
    const dispatch=useDispatch();
   
    // console.log(NotificationKey,"NOTIFICATIONKEY",Notifications[NotificationKey])
     const handleConversationId=()=>{
            dispatch(setConversationId(ConversationId));
        if(layout==="contacts")
            dispatch(setLayout("chat"));
        socket.emit("deleteNotification", `${NotificationKey}-${ConversationId}`);
     }
     useEffect(()=>{
        if(!Chat)
            return;
        let userId=User?.userId;
        if(Chat[ConversationId]?.Conversation?.type!=="group")
        {
            if(Chat[ConversationId]?.Conversation?.participants[1]===userId)
            {
                
                dispatch(setCurrChat(ContactData[Chat[ConversationId]?.Conversation?.participants[0]]))
                setContactUserId(Chat[ConversationId]?.Conversation?.participants[0])
            }
            else
            {
                setContactUserId(Chat[ConversationId]?.Conversation?.participants[1])
                dispatch(setCurrChat(ContactData[Chat[ConversationId]?.Conversation?.participants[1]]))
            }
        }
     },[Chat])
     useEffect(()=>{
   
        if(!socket||!User?.userId) return;
        setNotificationKey(`${User?.userId}-${ConversationId}`)
        if(NotificationKey.length>0)
        socket.emit("notification", NotificationKey);

     },[socket,User,contactUserId])
     if(!String(Chat[ConversationId]?.Group?.groupName||'').includes(search)&&!String(contactUserId||'').includes(search))
        return null;
    return (
        <div className="h-20 w-full bg-white hover:bg-gray-100 flex items-center px-4 py-2 m-1 rounded-lg transition-colors cursor-pointer" onClick={handleConversationId}>
           
            <div className="relative" onClick={(e)=>{socket.emit("deleteNotification", NotificationKey);}}>
                <img
                    className="h-14 w-14 rounded-full border-2 border-gray-200 object-cover"
                    src={ ContactData[contactUserId]?.profilePicture} 
                    alt={`'s profile`}
                />
                
                <span className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            
            <div className="flex-1 ml-4 grid gap-1">
                <div className="text-xl font-medium text-gray-800 truncate">{}</div>
                {Chat[ConversationId]?.Conversation?.type==="group" ? (
                    <div className="text-sm text-gray-500 truncate">Group • {Chat[ConversationId]?.Group?.groupName} members</div>
                ) : (
                    <div className="text-sm text-gray-500 truncate">{contactUserId}</div>
                )}
            </div>

            {Chat[ConversationId]?.Conversation?.type==="group"  && (
                <div className="ml-2">
                    <svg
                        className="h-6 w-6 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                    </svg>
                </div>
            )}
            <div className="relative inline-block">
 
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-gray-700"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 00-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
  {Notifications[NotificationKey]?.count > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow-lg">
      {Notifications[NotificationKey]?.count}
    </span>
  )}
</div>

            
        </div>
    );
}

export default ContactBox;