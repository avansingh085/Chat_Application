import React from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { setConversationId } from '../Redux/globalSlice';
function ContactBox({data:ConversationId}) {
    const {Chat }=useSelector((state)=>state.Chat)
    const dispatch=useDispatch();
     const handleConversationId=()=>{
        // console.log("OPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP")
        dispatch(setConversationId(ConversationId))
     }
    return (
        <div className="h-20 w-full bg-white hover:bg-gray-100 flex items-center px-4 py-2 m-1 rounded-lg transition-colors cursor-pointer" onClick={handleConversationId}>
           
            <div className="relative">
                <img
                    className="h-14 w-14 rounded-full border-2 border-gray-200 object-cover"
                    src={ 'https://randomuser.me/api/portraits/lego/1.jpg'} 
                    alt={`'s profile`}
                />
                
                <span className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></span>
            </div>

            <div className="flex-1 ml-4 grid gap-1">
                <div className="text-xl font-medium text-gray-800 truncate">{}</div>
                {Chat[ConversationId]?.Conversation?.type==="group" ? (
                    <div className="text-sm text-gray-500 truncate">Group • {Chat[ConversationId]?.group?.groupName} members</div>
                ) : (
                    <div className="text-sm text-gray-500 truncate">{Chat[ConversationId]?.Conversation?.participants[1]}</div>
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
        </div>
    );
}

export default ContactBox;