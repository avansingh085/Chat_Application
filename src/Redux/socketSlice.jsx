// Redux/socketSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';

let socket = null;

const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    socket: null,
    connected: false,
  },
  reducers: {
    setSocket(state, action) {
      state.socket = action.payload;
      state.connected = true;
    },
    disconnectSocket(state) {
      state.socket = null;
      state.connected = false;
    },
  },
});

export const { setSocket, disconnectSocket } = socketSlice.actions;

export const connectToSocket = (userId) => (dispatch, getState) => {
  if (!userId || socket) return;
  const SOCKET_URL =import.meta.env.VITE_BACKEND_URL;

  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    query: { userId },
  });

  socket.on('connect', () => {
    console.log(' Connected to socket:', socket.id);
    dispatch(setSocket(socket));
  });

  socket.on('connect_error', (err) => {
    console.error(' Socket connection error:', err.message);
  });

  socket.on('disconnect', (reason) => {
    console.warn(' Socket disconnected:', reason);
    dispatch(disconnectSocket());
  });
};

export const getSocket = () => socket;

export default socketSlice.reducer;
