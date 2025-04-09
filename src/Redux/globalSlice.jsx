import { createSlice } from '@reduxjs/toolkit';

const initialState = {
   
    isLogin:false,
    User:{},
    CurrChat:{},
    Chat:{},
   ConversationId:null,
    Contacts:{},
    ContactData:{},
    Notifications:{},

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
            ,
          
            setContactData:(state,action)=>{
               state.ContactData=action.payload;
            },
            setNotifications:(state,action)=>{
                state.Notifications=action.payload;
            },
           
    },

});

export const { setUser,setCurrChat,setChat,setConversationId,setContactData,setNotifications } = itemsSlice.actions;

export default itemsSlice.reducer;