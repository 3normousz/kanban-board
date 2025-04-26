import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

interface DecodedToken {
  exp: number;
  id: number;
  email: string;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const token = localStorage.getItem('token');

  const isTokenValid = (token: string): boolean => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  if (!token || !isTokenValid(token)) {
    localStorage.removeItem('token');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}