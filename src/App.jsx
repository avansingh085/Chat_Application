import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Componnnent from './Componnent/main.jsx'; // Note the typo in "Componnnent"
import { useSelector, useDispatch } from 'react-redux';
import Login from './Componnent/Login.jsx';
import { apiGet, apiPost } from './utils/apiClient.js';
import { useNavigate } from 'react-router-dom';
import { setChat, setUser,setContactData } from './Redux/globalSlice.jsx';
import io from "socket.io-client";

function App() {

  
  const [socket,setSocket] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [render, setRender] = useState(false);
  const isLogin = useSelector((state) => state.Chat?.isLogin);

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
  console.log(socket,"OPPPPPPPPPPPPPPPPPP")
  useEffect(() => {
    async function verifyToken() {
      try {
        let data = await apiPost('/verifyToken', { token: localStorage.getItem('token') });
        console.log(data);
        if (data.success) {
          console.log(data);
          dispatch(setChat(data.Chat));
          dispatch(setUser(data.User));
          dispatch(setContactData(data.ContactData));
          navigate('/chat');
          setRender(true);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.log(error);
        setRender(true);
      }
    }
    verifyToken();
  }, []);

  console.log(isLogin);

  return (
    <div className="h-screen w-screen flex justify-center items-center flex-col">
     
      {/* {render ? (isLogin ? <Componnnent /> : <Login />) : <div className="h-screen w-screen flex justify-center items-center text-2xl">Loading...</div>} */}
     <Componnnent  socket={socket}/>
    </div>
  );
}

export default App;