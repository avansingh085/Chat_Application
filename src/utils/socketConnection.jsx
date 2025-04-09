import io from "socket.io-client";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { setSocket } from "../Redux/socketSlice.jsx";
import { useDispatch } from "react-redux";
const socketConnection = () => {
    const dispatch = useDispatch();
    const socket = useSelector((state) => state.socket.socket);
    const {User} = useSelector((state) => state.Chat);
    console.log(User,"USER");
    useEffect(() => {
        console.log("AVANANNA")
        if (!User?.userId||socket) return;
        
            dispatch(setSocket(s)); 
            console.log(s,"PLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL");
            return () => {
                s.off("connect");
                s.off("message");
                s.off("connect_error");
                s.off("notification");
                s.disconnect();
            }
            
    },[User?.userId])
    return null;
}
export default socketConnection;