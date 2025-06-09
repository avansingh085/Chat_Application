import ContactHeader from "./ContactHeader";

import ContactBox from './ContactBox';
import {useState} from 'react'
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setNotifications } from "../Redux/userSlice";
function Contact({socket}){
const {User} =useSelector((state)=>state.Chat);
const dispatch=useDispatch();
const {Notifications}=useSelector((state)=>state.Chat);

const {layout} =useSelector((state)=>state.Chat);
useEffect(() => {
  if (!socket) return;

  const handleNotification = (data) => {
   
    const newNotification = {
      ...Notifications,
      [data.notificationKey]: {
        ...(Notifications[data.notificationKey] || {}),
        count: data.count,
      },
    };

    dispatch(setNotifications(newNotification));
  };

  socket.on('notification', handleNotification);

  // Cleanup to prevent duplicate listeners
  return () => {
    socket.off('notification', handleNotification);
  };

}, [socket, Notifications, dispatch]);
if(layout==="chat")
  return null;

return(
    <div className={`max-h-screen ${layout==="both" ? "w-5/12": "w-full"} `}>
        <ContactHeader/>
        <div className=" overflow-y-scroll h-full pb-16">
          {
             User?.contacts?.map((data,key)=>{
                return <ContactBox data={data} socket={socket}/>
             })
          }
        </div >
    </div>
)
}
export default Contact;