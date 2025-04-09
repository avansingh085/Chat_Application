
import socket from "socket.io-client";
import { createSlice } from "@reduxjs/toolkit";

const initialState={
    socket: null,
    isConnected: false,
}
const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload;
        },
        setConnectionStatus: (state, action) => {
            state.isConnected = action.payload;
        },
    },
});

export const { setSocket, setConnectionStatus } = socketSlice.actions;
export default socketSlice.reducer;