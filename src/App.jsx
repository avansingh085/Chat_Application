import { useEffect, useState } from 'react';
import './App.css';
import Component from './mainPage.jsx';
import { useSelector, useDispatch } from 'react-redux';
import Login from './pages/Login.jsx';
import io from 'socket.io-client';
import { fetchUser } from './Redux/userSlice.jsx';
import DotLoader from './components/Common/Loader.jsx';
import { generateKeyPair } from './utils/useEncryption.js';
function App() {
  const dispatch = useDispatch();

  const [socket, setSocket] = useState(null);

  const loading = useSelector((state) => state.Chat?.loading);
  const { User } = useSelector((state) => state.Chat);
  // Fetch user on initial mount
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);
  

  useEffect(() => {
    if (!User?.userId || socket) return;

    const socketInstance = io(import.meta.env.VITE_BACKEND_URL, {
      transports: ['websocket'],
      query: { userId: User.userId },
    });

    socketInstance.on('connect', () => {
      console.log('Connected to socket:', socketInstance.id);
      setSocket(socketInstance);
    });

    return () => {
      socketInstance.off('connect');
      socketInstance.off('message');
      socketInstance.off('connect_error');
      socketInstance.off('notification');
      socketInstance.disconnect();
    };
  }, [User?.userId]);

  if (loading) return <DotLoader />;

  return (
    <main className="max-h-screen max-w-screen flex justify-center items-center flex-col">
      <Component socket={socket} />
    </main>
  );
}

export default App;
