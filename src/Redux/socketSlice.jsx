
import socket from "socket.io-client";
import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
export const  socketCon=createAsyncThunk('socket/socketCon',(_,thunkAPI)=>{
    try{

    }
    catch(err)
    {

    }
})
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