import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Componnnent from './Componnent/main.jsx'; // Note the typo in "Componnnent"
import { useSelector, useDispatch } from 'react-redux';
import Login from './Componnent/Login.jsx';
import { apiGet, apiPost } from './utils/apiClient.js';
import { useNavigate } from 'react-router-dom';
import { setChat, setUser } from './Redux/globalSlice.jsx';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [render, setRender] = useState(false);
  const isLogin = useSelector((state) => state.Chat?.isLogin);

  useEffect(() => {
    async function verifyToken() {
      try {
        let data = await apiPost('/verifyToken', { token: localStorage.getItem('token') });
        console.log(data);
        if (data.success) {
          console.log(data);
          dispatch(setChat(data.Chat));
          dispatch(setUser(data.User));
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
      <Componnnent />
    </div>
  );
}

export default App;