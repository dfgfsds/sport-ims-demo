// components/PrivateRoute.tsx
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const PrivateRoute = ({ children }: Props) => {
  const isLoggedIn = localStorage.getItem('user'); // Replace with your actual auth logic
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute; // ✅ This line must exist
