import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
function useAuth() {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return accessToken == "0";
  const token = jwtDecode(localStorage.getItem("accessToken"));
  return token.role;
}
function UserRoute() {
  const isAuth = useAuth();
  return isAuth == "1" ? <Outlet /> : <Navigate to="/login" />;
}
export default UserRoute;
