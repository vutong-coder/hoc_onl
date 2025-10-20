import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';

interface AuthRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  roles?: string[];
}

const AuthRoute: React.FC<AuthRouteProps> = ({ 
  children, 
  requireAuth = true, 
  roles = [] 
}) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated but trying to access login/register pages
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If specific roles are required
  if (requireAuth && roles.length > 0 && user) {
    const hasRequiredRole = roles.includes(user.role);
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

export default AuthRoute;
