import { toast } from "react-toastify";

export const Success = (mes) => {
  toast.success(mes, {
    position: "top-right",    
    autoClose: 3000,        
    hideProgressBar: false,  
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",        
    style: {
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: "500",
    },
  });
};

// ❌ Error Toast
export const Error = (mes) => {
  toast.error(mes, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
    style: {
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: "500",
    },
  });
};
