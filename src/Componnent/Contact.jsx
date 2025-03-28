import ContactHeader from "./ContactHeader";
import fakeContact from './fakeContact'
import ContactBox from './ContactBox';
import {useState} from 'react'
import { useSelector } from "react-redux";
function Contact(){
const {User} =useSelector((state)=>state.Chat)
return(
    <div className="max-h-screen w-4/12 ">
        <ContactHeader/>
        <div className=" overflow-y-scroll h-full pb-16">
          {
             User?.contacts?.map((data,key)=>{
                return <ContactBox data={data}/>
             })
          }
        </div >
    </div>
)
}
export default Contact;