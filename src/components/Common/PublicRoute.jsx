import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = ({ children }) => {
  const isLogin = useSelector((state) => state.Chat.isLogin);
  if (isLogin) {
    return <Navigate to="/chat" replace />;
  }
  return children;
};

export default PublicRoute;
