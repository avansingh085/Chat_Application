import ContactHeader from "./ContactHeader";
import fakeContact from './fakeContact'
import ContactBox from './ContactBox';
import {useState} from 'react'
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setNotifications } from "../Redux/globalSlice";
function Contact({socket}){
const {User} =useSelector((state)=>state.Chat);
const dispatch=useDispatch();
const {Notifications}=useSelector((state)=>state.Chat);
useEffect(() => {
  if (!socket) return;

  const handleNotification = (data) => {
    console.log("AVAN_SOCKET", data, Notifications);

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

console.log(Notifications,"NOTIFICATION")

return(
    <div className="max-h-screen w-4/12 ">
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