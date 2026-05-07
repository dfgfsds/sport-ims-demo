// ProtectedRoute.tsx
import { Navigate, Outlet, useNavigate } from "react-router-dom";

export const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const location = window.location.pathname;


  
  const navigate =useNavigate();
  if (!role && location === "/") {
    navigate('/login')
  }

  if (!role || !userId) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
