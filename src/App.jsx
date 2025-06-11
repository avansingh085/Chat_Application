import { useEffect, useState } from 'react';
import './App.css';
import Component from './mainPage.jsx';
import { useSelector, useDispatch } from 'react-redux';
import Login from './pages/Login.jsx';
import io from "socket.io-client";
import { fetchUser } from './Redux/userSlice.jsx';
import DotLoader from './components/Common/Loader.jsx';
import { getToken } from './utils/apiClient.js';

function App() {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.Chat?.loading);
  const { User } = useSelector((state) => state.Chat);
  useEffect(() => {
    if (socket || !User?.userId) return;

    const s = io("https://chat-application-backend-w648.onrender.com", {
      transports: ["websocket"],

      query: { userId: User?.userId },
    });
    s.on("connect", () => {
      console.log("Connected to socket:", s.id, s);
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
   
  }, []);
  if (loading) {
    return <DotLoader />
  }
 

  return (
    <main className="max-h-screen max-w-screen flex justify-center items-center flex-col">

     <Component/>

    </main>
  );
}

export default App;