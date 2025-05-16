import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Componnnent from './Componnent/main.jsx'; 
import { useSelector, useDispatch } from 'react-redux';
import Login from './Componnent/Login.jsx';
import { useNavigate } from 'react-router-dom';
import io from "socket.io-client";
import { fetchUser } from './Redux/userSlice.jsx';
import DotLoader from './Componnent/Loader.jsx';

function App() {
  const [socket,setSocket] = useState(null);
  const dispatch = useDispatch();
  const [render, setRender] = useState(false);
  const isLogin = useSelector((state) => state.Chat?.isLogin);
  const loading=useSelector((state)=>state.Chat.loading)
  const { User } = useSelector((state) => state.Chat);
  useEffect(() => {
    if(socket||!User?.userId) return;
    const s= io("https://chat-backend-1-3dgt.onrender.com", {
      transports: ["websocket"],
      query: { userId: User?.userId },});
      s.on("connect", () => {
        console.log("Connected to socket:", s.id);
      })
      setSocket(s);
      return () => {
        s.off("connect");
        s.off("message");
        s.off("connect_error");
        s.off("notification");
        s.disconnect();
      }
  }, [User]);
 
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
     
      {render ? (isLogin ? <Componnnent /> : <Login />) : <div className="h-screen w-screen flex justify-center items-center text-2xl">Loading...</div>}
    
    </div>
  );
}

export default App;