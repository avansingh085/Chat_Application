import { createSlice } from '@reduxjs/toolkit';

const initialState = {
   
    isLogin:false,
    User:{},
    CurrChat:{},
    Chat:{},
   ConversationId:null,
    Contacts:{}
};
const itemsSlice = createSlice({
  
    name: 'Chat',

    initialState,
    reducers: {
    
       setUser:(state,action)=>{
              state.User = action.payload
              state.isLogin = true;

       },
         setCurrChat:(state,action)=>{
                  state.CurrChat = action.payload
         },
         setChat:(state,action)=>{
                state.Chat = action.payload
            }
            ,
            setConversationId:(state,action)=>{
                state.ConversationId=action.payload;
            }
           
    },

});

export const { setUser,setCurrChat,setChat,setConversationId } = itemsSlice.actions;

export default itemsSlice.reducer;