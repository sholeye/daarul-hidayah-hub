import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { mockUsers, mockStudents } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  getStudentByUserId: () => typeof mockStudents[0] | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('daarul_hidayah_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock authentication - in real app this would be an API call
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!foundUser) {
      return { success: false, message: 'User not found. Please check your email.' };
    }

    // Mock password check (any password works for demo)
    if (password.length < 4) {
      return { success: false, message: 'Invalid password. Please try again.' };
    }

    setUser(foundUser);
    localStorage.setItem('daarul_hidayah_user', JSON.stringify(foundUser));
    return { success: true, message: 'Login successful!' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('daarul_hidayah_user');
  }, []);

  const getStudentByUserId = useCallback(() => {
    if (!user || user.role !== 'learner') return null;
    // In a real app, this would fetch the student linked to the user
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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Role-based route protection hook
export const useRequireRole = (allowedRoles: UserRole[]): { hasAccess: boolean; role: UserRole | null } => {
  const { user } = useAuth();
  const hasAccess = user ? allowedRoles.includes(user.role) : false;
  return { hasAccess, role: user?.role || null };
};
