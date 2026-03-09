import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/types';
import { pickPrimaryRole } from '@/features/auth/roleUtils';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { t, isRTL } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

  const getRoleBasedPath = (role: UserRole) => {
    switch (role) {
      case 'admin': return '/admin';
      case 'instructor': return '/instructor';
      case 'learner': return '/learner';
      case 'parent': return '/parent';
      default: return '/';
    }
  };

  const canAccessPath = (role: UserRole, path?: string) => {
    if (!path) return false;
    // Admin is a superuser in this app
    if (role === 'admin') return true;

    if (path.startsWith('/admin')) return role === 'admin';
    if (path.startsWith('/instructor')) return role === 'instructor';
    if (path.startsWith('/learner')) return role === 'learner';
    if (path.startsWith('/parent')) return role === 'parent';
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    if (result.success) {
      toast.success(t.success || 'Login successful!');
      // Fetch the user's role to redirect properly
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session?.user) {
        const { data: roleRows } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', sessionData.session.user.id);

        const role = pickPrimaryRole(roleRows, sessionData.session.user.user_metadata?.role);
        const fallbackPath = getRoleBasedPath(role);
        navigate(canAccessPath(role, from) ? from! : fallbackPath, { replace: true });
      } else {
        navigate(from || '/', { replace: true });
      }
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 islamic-pattern" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <FiArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">{t.backToHome}</span>
        </Link>

        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto mb-5 shadow-glow">
            <span className="text-primary-foreground font-bold text-3xl">د</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t.welcomeBackLogin}</h1>
          <p className="text-muted-foreground mt-2">{t.signInToPortal}</p>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-medium p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t.emailAddress}</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.enterEmail} className="pl-12 h-12" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t.passwordLabel}</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t.enterPassword} className="pl-12 pr-12 h-12" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-12 text-base font-medium btn-glow" disabled={isLoading}>
              {isLoading ? t.signingIn : t.signIn}
              <FiLogIn className="w-5 h-5 ml-2" />
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            Instructor or Parent?{' '}
            <Link to="/signup" className="text-primary hover:underline font-medium">Create an account</Link>
          </p>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Students receive login credentials from the school administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
