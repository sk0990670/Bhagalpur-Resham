import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';

interface ProtectedRouteProps {
  requireAuth?: boolean;
  allowedRoles?: string[];
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  requireAuth = true, 
  allowedRoles = [], 
  children 
}) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (requireAuth && !isAuthenticated) {
    // Determine where to redirect based on where they tried to go
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAuth && isAuthenticated && allowedRoles.length > 0) {
    // If user's role is not in the allowed list
    if (!user || !user.role || !allowedRoles.includes(user.role)) {
      // Redirect admins trying to access customer pages back to admin dashboard
      if (user?.role === 'admin' || user?.role === 'superadmin') {
        return <Navigate to="/admin/dashboard" replace />;
      }
      // Redirect customers trying to access admin pages back to customer dashboard
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children ? children : <Outlet />}</>;
};

export default ProtectedRoute;
