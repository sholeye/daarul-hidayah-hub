/**
 * =============================================================================
 * AUTHENTICATION CONTEXT
 * =============================================================================
 * 
 * Provides authentication state and methods throughout the application.
 * Supports predefined admin login and auto-generated student credentials.
 * 
 * Admin Credentials:
 * - Username: mudeer@dh.edu
 * - Password: daarulhidayah1447
 * 
 * Instructor Credentials:
 * - Username: muallim@dh.edu
 * - Password: daarulhidayah1447
 * =============================================================================
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { mockUsers, mockStudents } from '@/data/mockData';

// ---------------------------------------------------------------------------
// Predefined Credentials
// ---------------------------------------------------------------------------
const PREDEFINED_CREDENTIALS = {
  admin: {
    email: 'mudeer@dh.edu',
    password: 'daarulhidayah1447',
    name: 'Administrator',
  },
  instructor: {
    email: 'muallim@dh.edu',
    password: 'daarulhidayah1447',
    name: 'Instructor',
  },
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, selectedRole?: UserRole) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  getStudentByUserId: () => typeof mockStudents[0] | null;
  requestPasswordReset: (studentId: string) => Promise<{ success: boolean; message: string }>;
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
   * Login function - supports predefined credentials and demo mode
   */
  const login = useCallback(async (
    email: string, 
    password: string,
    selectedRole?: UserRole
  ): Promise<{ success: boolean; message: string }> => {
    // Simulate API delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 600));

    const emailLower = email.toLowerCase().trim();
    const passwordTrimmed = password.trim();

    // Check predefined admin credentials
    if (emailLower === PREDEFINED_CREDENTIALS.admin.email && 
        passwordTrimmed === PREDEFINED_CREDENTIALS.admin.password) {
      const adminUser: User = {
        id: 'admin-001',
        email: PREDEFINED_CREDENTIALS.admin.email,
        name: PREDEFINED_CREDENTIALS.admin.name,
        role: 'admin',
      };
      setUser(adminUser);
      localStorage.setItem('daarul_hidayah_user', JSON.stringify(adminUser));
      return { success: true, message: 'Login successful!' };
    }

    // Check predefined instructor credentials
    if (emailLower === PREDEFINED_CREDENTIALS.instructor.email && 
        passwordTrimmed === PREDEFINED_CREDENTIALS.instructor.password) {
      const instructorUser: User = {
        id: 'instructor-001',
        email: PREDEFINED_CREDENTIALS.instructor.email,
        name: PREDEFINED_CREDENTIALS.instructor.name,
        role: 'instructor',
      };
      setUser(instructorUser);
      localStorage.setItem('daarul_hidayah_user', JSON.stringify(instructorUser));
      return { success: true, message: 'Login successful!' };
    }

    // Check for student login (auto-generated credentials)
    // Student username format: firstname.lastname@student.dh.edu
    if (emailLower.includes('@student.dh.edu')) {
      const student = mockStudents.find(s => {
        const expectedUsername = s.fullName.toLowerCase().replace(/\s+/g, '.') + '@student.dh.edu';
        return expectedUsername === emailLower;
      });

      if (student) {
        // For demo: password is studentId (in real app, this would be hashed)
        if (passwordTrimmed === student.studentId || passwordTrimmed.length >= 4) {
          const studentUser: User = {
            id: student.id,
            email: emailLower,
            name: student.fullName,
            role: 'learner',
          };
          setUser(studentUser);
          localStorage.setItem('daarul_hidayah_user', JSON.stringify(studentUser));
          return { success: true, message: 'Login successful!' };
        }
      }
    }

    // DEMO MODE: Allow any email/password with selected role for testing
    if (email.includes('@') && password.length >= 4) {
      const foundUser: User = {
        id: Date.now().toString(),
        email: email,
        name: email.split('@')[0].replace(/\./g, ' ').replace(/^\w/, c => c.toUpperCase()),
        role: selectedRole || 'admin',
      };
      setUser(foundUser);
      localStorage.setItem('daarul_hidayah_user', JSON.stringify(foundUser));
      return { success: true, message: 'Login successful (Demo Mode)!' };
    }
    
    return { success: false, message: 'Invalid credentials. Please check your email and password.' };
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

  /**
   * Request password reset - notifies admin (for students)
   */
  const requestPasswordReset = useCallback(async (studentId: string): Promise<{ success: boolean; message: string }> => {
    // In real app, this would create a notification for admin in database
    await new Promise(resolve => setTimeout(resolve, 500));
    return { 
      success: true, 
      message: 'Password reset request sent to administrator. You will receive your new password in person.' 
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      logout,
      getStudentByUserId,
      requestPasswordReset,
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

/**
 * Generate student credentials
 */
export const generateStudentCredentials = (fullName: string, studentId: string) => {
  const username = fullName.toLowerCase().replace(/\s+/g, '.') + '@student.dh.edu';
  // In real app, password would be hashed before storing
  const password = studentId; // Initial password is studentId
  return { username, password };
};
