/**
 * ProtectedRoute - Route protection with role-based access
 * 
 * NOTE: Demo mode enabled - authentication bypassed for testing.
 * Uncomment the checks below when ready for production.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // ============= DEMO MODE - COMMENT OUT FOR PRODUCTION =============
  // For demo purposes, bypass auth checks completely
  // This allows viewing any dashboard without logging in
  return <>{children}</>;
  // ==================================================================

  /* PRODUCTION CODE - UNCOMMENT WHEN READY:
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
  */
};
