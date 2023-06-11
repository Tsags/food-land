import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedAdminRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.user);

  return userInfo.isAdmin === "true" ? children : <Navigate to="/login" />;
};
export default ProtectedAdminRoute;
