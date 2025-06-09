import { useEffect, useState } from 'react';
import './App.css';
import Componnnent from './Componnent/main.jsx'; 
import { useSelector, useDispatch } from 'react-redux';
import Login from './Componnent/Login.jsx';
import io from "socket.io-client";
import { fetchUser } from './Redux/userSlice.jsx';
import DotLoader from './Componnent/Loader.jsx';
import { getToken } from './utils/apiClient.js';

function App() {
  const [socket,setSocket] = useState(null);
  const dispatch = useDispatch();
  const [render, setRender] = useState(false);
  const loading=useSelector((state)=>state.Chat?.loading)
  const isLogin = useSelector((state) => state.Chat?.isLogin);
  const { User } = useSelector((state) => state.Chat);
  useEffect(() => {
    if(socket||!User?.userId) return;
     
    const s= io("https://chat-application-backend-w648.onrender.com", {
      transports: ["websocket"],
  
      query: { userId: User?.userId },});
      s.on("connect", () => {
        console.log("Connected to socket:", s.id,s);
        setSocket(s);
      })
    
      
      return () => {
        s.off("connect");
        s.off("message");
        s.off("connect_error");
        s.off("notification");
        s.disconnect();
      }
      
  }, [User?.userId]);
 
  useEffect(() => {
    
    dispatch(fetchUser());
     setRender(true);
  }, []);
 if(loading)
 {
  return <DotLoader/>
 }

  return (
    <div className="max-h-screen max-w-screen flex justify-center items-center flex-col">
     
      {render ? (isLogin ? <Componnnent socket={socket}/> : <Login />) : <div className="h-screen w-screen flex justify-center items-center text-2xl">Loading...</div>}
   
    </div>
  );
}

export default App;