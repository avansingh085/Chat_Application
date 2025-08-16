export const setToken=(token=null)=>{
     localStorage.setItem(token);
}

export const getToken=()=>{
  return localStorage.getItem('ChatsToken');
}

export const removeToken=()=>{
    localStorage.removeItem('ChatsToken');
}