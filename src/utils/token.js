export const setToken=(token=null)=>{
     localStorage.setItem('ChatsToken',token);
}

export const getToken=async ()=>{
  return await localStorage.getItem('ChatsToken');
}

export const removeToken=async ()=>{
   await  localStorage.removeItem('ChatsToken');
}