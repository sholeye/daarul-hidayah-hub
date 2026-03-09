/**
 * Authentication Context - Real Supabase Auth
 * 
 * Students: auto-generated @dh.edu emails, admin creates accounts
 * Teachers/Parents: real emails, sign up themselves
 */

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { supabase, createIsolatedAuthClient } from '@/lib/supabase';
import { pickPrimaryRole } from './roleUtils';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  createStudentAccount: (email: string, password: string, fullName: string) => Promise<{ success: boolean; userId?: string; message: string }>;
  getStudentByUserId: () => null; // Will use shared data now
  requestPasswordReset: (studentId: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to fetch user with role
  const fetchUserWithRole = useCallback(async (sessionUser: any) => {
    const { data: roleRows, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', sessionUser.id);

    if (error) {
      console.error('Role lookup failed:', error.message);
    }

    const role = pickPrimaryRole(roleRows, sessionUser.user_metadata?.role);
    const fullName = sessionUser.user_metadata?.full_name || sessionUser.email?.split('@')[0] || 'User';

    setUser({
      id: sessionUser.id,
      email: sessionUser.email || '',
      name: fullName,
      role,
    });
    setIsLoading(false);
  }, []);

  // Listen for auth state changes — no await in the callback to prevent deadlocks
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Use setTimeout to avoid blocking the auth state change
        setTimeout(() => fetchUserWithRole(session.user), 0);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserWithRole(session.user);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshUser = useCallback(async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Failed to refresh user:', error.message);
      return;
    }

    if (data.user) {
      await fetchUserWithRole(data.user);
    } else {
      setUser(null);
    }
  }, [fetchUserWithRole]);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password.trim(),
    });

    if (error) {
      return { success: false, message: error.message };
    }

    if (data.user) {
      return { success: true, message: 'Login successful!' };
    }

    return { success: false, message: 'Login failed. Please try again.' };
  }, []);

  const signup = useCallback(async (email: string, password: string, fullName: string, role: UserRole): Promise<{ success: boolean; message: string }> => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: password.trim(),
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    if (error) {
      return { success: false, message: error.message };
    }

    if (data.user) {
      return { success: true, message: 'Account created successfully! You can now log in.' };
    }

    return { success: false, message: 'Signup failed. Please try again.' };
  }, []);

  const createStudentAccount = useCallback(
    async (email: string, password: string, fullName: string): Promise<{ success: boolean; userId?: string; message: string }> => {
      // Use isolated auth client so admin session is never replaced by the new student session
      const isolatedAuth = createIsolatedAuthClient();

      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPassword = password.trim();

      const { data: signUpData, error: signUpError } = await isolatedAuth.auth.signUp({
        email: normalizedEmail,
        password: normalizedPassword,
        options: {
          data: {
            full_name: fullName,
            role: 'learner',
          },
        },
      });

      // If a previous attempt created the auth user but failed later (e.g. DB insert),
      // Supabase will return "user already exists" on re-try. In that case, try to sign in
      // with the known initial password (student_id) to recover the user id.
      if (signUpError) {
        const msg = signUpError.message.toLowerCase();
        const isAlreadyRegistered =
          msg.includes('already') && (msg.includes('registered') || msg.includes('exists'));

        if (isAlreadyRegistered) {
          const { data: signInData, error: signInError } = await isolatedAuth.auth.signInWithPassword({
            email: normalizedEmail,
            password: normalizedPassword,
          });

          if (!signInError && signInData.user?.id) {
            // Ensure we don't keep any in-memory session around
            await isolatedAuth.auth.signOut();
            return {
              success: true,
              userId: signInData.user.id,
              message: 'Student login already existed — linked successfully.',
            };
          }

          return {
            success: false,
            message:
              'A user with this student email already exists. If the password was changed, use the password reset request flow instead of re-registering.',
          };
        }

        return { success: false, message: signUpError.message };
      }

      if (!signUpData.user?.id) {
        return {
          success: false,
          message:
            'Student account creation did not return a user id. Ensure email confirmation is disabled in Auth settings, then try again.',
        };
      }

      await isolatedAuth.auth.signOut();
      return { success: true, userId: signUpData.user.id, message: 'Student account created!' };
    },
    [],
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const getStudentByUserId = useCallback(() => null, []);

  const requestPasswordReset = useCallback(async (studentId: string): Promise<{ success: boolean; message: string }> => {
    const { error } = await supabase.from('password_reset_requests').insert({
      student_id: studentId,
      status: 'pending',
    });
    if (error) return { success: false, message: 'Failed to submit request.' };
    return { success: true, message: 'Password reset request sent to administrator.' };
  }, []);

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: !!user, isLoading,
      login, signup, logout, createStudentAccount,
      getStudentByUserId, requestPasswordReset,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const useRequireRole = (allowedRoles: UserRole[]): { hasAccess: boolean; role: UserRole | null } => {
  const { user } = useAuth();
  return { hasAccess: user ? allowedRoles.includes(user.role) : false, role: user?.role || null };
};

export const generateStudentCredentials = (_fullName: string, studentId: string) => {
  // Use studentId to guarantee uniqueness; name-based emails collide easily.
  const localPart = studentId
    .toLowerCase()
    .replace(/\s+/g, '.')
    .replace(/[^a-z0-9._-]/g, '');

  const username = `${localPart}@dh.edu`;
  return { username, password: studentId };
};
