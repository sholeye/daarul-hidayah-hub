/**
 * =============================================================================
 * AUTHENTICATION CONTEXT
 * =============================================================================
 * 
 * Provides authentication state and methods throughout the application.
 * Currently uses mocked authentication - can be easily switched to Supabase Auth.
 * 
 * Features:
 * - Login with any demo role (admin, instructor, learner)
 * - Persistent session via localStorage
 * - Role-based access control hooks
 * =============================================================================
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { mockUsers, mockStudents } from '@/data/mockData';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, selectedRole?: UserRole) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  getStudentByUserId: () => typeof mockStudents[0] | null;
}

// ---------------------------------------------------------------------------
// Context Creation
// ---------------------------------------------------------------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Auth Provider Component
// ---------------------------------------------------------------------------
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize user state from localStorage for persistence
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('daarul_hidayah_user');
    return stored ? JSON.parse(stored) : null;
  });

  /**
   * Login function - currently mocked for development
   * Accepts any role selection to allow testing all dashboard views
   */
  const login = useCallback(async (
    email: string, 
    password: string,
    selectedRole?: UserRole
  ): Promise<{ success: boolean; message: string }> => {
    // Simulate API delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 600));

    // Find user by email or create mock user with selected role
    let foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    // If user not found but valid email format, create temporary mock user
    if (!foundUser && email.includes('@')) {
      foundUser = {
        id: Date.now().toString(),
        email: email,
        name: email.split('@')[0].replace(/\./g, ' ').replace(/^\w/, c => c.toUpperCase()),
        role: selectedRole || 'admin', // Default to admin for testing
      };
    }
    
    if (!foundUser) {
      return { success: false, message: 'Invalid email format. Please try again.' };
    }

    // Mock password validation (any password with 4+ chars works)
    if (password.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters.' };
    }

    // If role was explicitly selected, override the found user's role
    if (selectedRole) {
      foundUser = { ...foundUser, role: selectedRole };
    }

    // Save to state and localStorage
    setUser(foundUser);
    localStorage.setItem('daarul_hidayah_user', JSON.stringify(foundUser));
    
    return { success: true, message: 'Login successful!' };
  }, []);

  /**
   * Logout function - clears session
   */
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('daarul_hidayah_user');
  }, []);

  /**
   * Get student data linked to current user (for learner role)
   */
  const getStudentByUserId = useCallback(() => {
    if (!user || user.role !== 'learner') return null;
    return mockStudents.find(s => s.email === user.email) || mockStudents[0];
  }, [user]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      logout,
      getStudentByUserId 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// ---------------------------------------------------------------------------
// Custom Hooks
// ---------------------------------------------------------------------------

/**
 * Hook to access auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Hook for role-based route protection
 */
export const useRequireRole = (allowedRoles: UserRole[]): { hasAccess: boolean; role: UserRole | null } => {
  const { user } = useAuth();
  const hasAccess = user ? allowedRoles.includes(user.role) : false;
  return { hasAccess, role: user?.role || null };
};
