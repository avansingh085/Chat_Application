import React, { useState } from 'react';
import UserProfile from './userProfile';
import { useSelector,useDispatch } from 'react-redux';
import { setLayout } from '../Redux/globalSlice';
function Hamburger() {
    const [isOpenProfile, setOpenProfile] = useState(false);
     const {User}=useSelector((state)=>state.Chat);
     const dispatch=useDispatch();
    const {layout}=useSelector((state)=>state.Chat);
    return (
        <div className="w-16 h-screen border-x-2 bg-gray-100 flex flex-col justify-between py-4">
            
            <div className="grid gap-6 w-16 items-center justify-center">
                <a href="#home" title="Home">
                    <svg className="h-8 w-8 text-gray-700 hover:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                    </svg>
                </a>

                <button href="#messages" title="Messages" onClick={() => dispatch(setLayout('chat'))}>
                    <svg className="h-8 w-8 text-gray-700 hover:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                    </svg>
                </button>

                <a href="#notifications" title="Notifications">
                    <svg className="h-8 w-8 text-gray-700 hover:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5S10 3.17 10 4v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                    </svg>
                </a>

                <button href="#contacts" title="Contacts" onClick={((e) => dispatch(setLayout('contacts')))}>
                    <svg className="h-8 w-8 text-gray-700 hover:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16.5 13c-1.2 0-3.07.34-4.5 1-1.43-.67-3.3-1-4.5-1C5.33 13 2 14.08 2 16.25V19h20v-2.75c0-2.17-3.33-3.25-5.5-3.25zM12.5 11c1.38 0 2.5-1.12 2.5-2.5S13.88 6 12.5 6 10 7.12 10 8.5 11.12 11 12.5 11z" />
                    </svg>
                </button>
            </div>
            <div className="grid gap-6 w-16 items-center justify-center">
                <button title="Profile" onClick={() => setOpenProfile(prev => !prev)}>
                    <img
                        className="h-12 w-12 rounded-full border-2 border-gray-300 hover:border-blue-500"
                        src={User?.profilePicture }
                        alt="User Profile"
                    />
                    
                </button>
                {isOpenProfile && <UserProfile isOpen={isOpenProfile} onClose={() => setOpenProfile(false)} />}
                <a href="#friends" title="Friends">
                    <svg className="h-8 w-8 text-gray-700 hover:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 12c0-1.1.9-2 2-2s2 .9 2 2-1.9 4-4 4-4-2.9-4-4 1.9-2 4-2m0-2c-2.2 0-4 1.8-4 4s1.8 6 4 6 6-3.8 6-6-1.8-4-4-4zm-7 2c0-1.1.9-2 2-2s2 .9 2 2-1.9 4-4 4-4-2.9-4-4 1.9-2 4-2m0-2c-2.2 0-4 1.8-4 4s1.8 6 4 6 6-3.8 6-6-1.8-4-4-4z" />
                    </svg>
                </a>

                <a href="#settings" title="Settings">
                    <svg className="h-8 w-8 text-gray-700 hover:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.43-.48-.43h-3.84c-.24 0-.43.19-.47.43l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96c-.22-.07-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.3-.06.62-.06.94 0 .32.02.64.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.04.24.24.43.48.43h3.84c.24 0 .43-.19.47-.43l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.07.47 0 .59-.22l1.92-3.32c.12-.22.08-.47-.12-.61l-2.03-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                    </svg>
                </a>

                <a href="#logout" title="Logout">
                    <svg className="h-8 w-8 text-gray-700 hover:text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
                    </svg>
                </a>
            </div>
        </div>
    );
}

export default Hamburger;
