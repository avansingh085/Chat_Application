import React, {useState,useEffect} from 'react';
import { useSelector } from 'react-redux';
import Profile from './Profile';
function ChatHeader() {
  const {ConversationId,Chat,ContactData,User}=useSelector((state)=>state.Chat)
  const [showProfile,setShowProfile]=useState(false);
  const [contactUserId,setContactUserId]=useState("");
  console.log(ConversationId,Chat)
  const handleShowProfile=()=>{

  }
  console.log(contactUserId,"AVANNA<")
   useEffect(()=>{
          if(!Chat)
              return;
          let userId=User?.userId;
          console.log(Chat)
          if(Chat[ConversationId]?.Conversation?.type!=="group")
          {
            console.log(Chat[ConversationId]?.Conversation?.participants,"pppppppppppppp")
              if(Chat[ConversationId]?.Conversation?.participants[1]===userId)
              {
                  setContactUserId(Chat[ConversationId]?.Conversation?.participants[0])
              }
              else
              {
                  setContactUserId(Chat[ConversationId]?.Conversation?.participants[1])
              }
          }
          console.log(userId)
       },[Chat,ConversationId])
    return (
        <div className="h-20 w-full border-y-2 bg-white flex items-center justify-between px-4 shadow-sm">
            {/* Left Section: User Info */}
            <div className="flex items-center space-x-4">
                <img
                    className="h-14 w-14 rounded-full border-2 border-gray-300"
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="User Avatar"
                    onClick={()=>{setShowProfile(!showProfile)}}
                />
                {
                  showProfile&&<Profile onClose={()=>{setShowProfile(false)}} isOpen={showProfile} isGroup={(Chat[ConversationId]?.Conversation?.type==="group")} profileUser={ContactData[contactUserId]} />
                }
                <div className="flex flex-col">
                  {
                    Chat[ConversationId]?.Conversation?.type==="group" ?  <span className="text-xl font-semibold text-gray-800">{Chat[ConversationId]?.group?.groupName}</span>:
                    <span className="text-xl font-semibold text-gray-800">{contactUserId}</span>
                  }
                    
                </div>
            </div>

            {/* Right Section: Action Buttons */}
            <div className="flex items-center space-x-4">
                {/* Video Call Button */}
                <button
                    title="Video Call"
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
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

                {/* Voice Call Button */}
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