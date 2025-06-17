import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import  { apiGet, apiPost } from "../utils/apiClient";
export const fetchUser=createAsyncThunk('user/fetchuser',async (_,thunkAPI)=>{
    try{
      return await apiGet('/user/get');
    }
    catch(err)
    {
       return thunkAPI.rejectWithValue(
            error.response?.data?.message || error.message || 'Failed to fetch user'
        )
    }

})
const initialState = {

    isLogin: false,
    User: {},
    CurrChat: {},
    Chat: {},
    ConversationId: null,
    Contacts: {},
    ContactData: {},
    Notifications: {},
    allUsers:[],
    layout:"both",
    loading:false,
    error:null,

};
const itemsSlice = createSlice({

    name: 'Chat',

    initialState,
    reducers: {

        setUser: (state, action) => {
            state.User = action.payload
            state.isLogin = true;

        },
        setCurrChat: (state, action) => {
            state.CurrChat = action.payload
        },
        setChat: (state, action) => {
            state.Chat = action.payload
        }
        ,
        setConversationId: (state, action) => {
            state.ConversationId = action.payload;
        }
        ,
        setAllUsers:(state,action)=>{
            state.allUsers=action.payload;
        },

        setContactData: (state, action) => {
            state.ContactData = action.payload;
        },
        setNotifications: (state, action) => {
            state.Notifications = action.payload;
        },
        setLayout:(state,action)=>{
            state.layout=action.payload;
        }
    },
    extraReducers:(builder)=>{builder.addCase(fetchUser.pending,(state,action)=>{
        state.isLogin=false,
        state.loading=true;


    })
    .addCase(fetchUser.fulfilled,(state,action)=>{
        state.Chat=action.payload.Chat;
        state.ContactData=action.payload.ContactData;
        state.User=action.payload.User;
        state.allUsers=action.payload.allUsers;
        state.loading=false;
        state.isLogin=true;

    })
    .addCase(fetchUser.rejected,(state,action)=>{
        state.isLogin=false;
        state.loading=false;
        state.error=action.payload;

    })


    }

});

export const { setUser, setCurrChat, setChat, setConversationId, setContactData, setNotifications,setLayout } = itemsSlice.actions;

export default itemsSlice.reducer;