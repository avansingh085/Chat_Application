import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const ProtectedRoute = ({ children }) => {

  if (!useSelector((state)=>state.Chat.isLogin)) {
    return <Navigate to="/Login" replace />;
  }
  return children;
};

export default ProtectedRoute;