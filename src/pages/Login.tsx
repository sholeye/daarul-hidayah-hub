import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn, FiUser, FiUsers, FiBookOpen, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { UserRole } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { t, isRTL } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const roleOptions: { role: UserRole; label: string; icon: React.ElementType; description: string }[] = [
    { role: 'admin', label: t.administrator, icon: FiUsers, description: t.fullAccessDesc },
    { role: 'instructor', label: t.instructor, icon: FiBookOpen, description: t.manageClassesDesc },
    { role: 'learner', label: t.student, icon: FiUser, description: t.viewGradesDesc },
    { role: 'parent', label: t.parent, icon: FiUsers, description: t.monitorChildrenDesc },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await login(email, password, selectedRole);
    setIsLoading(false);
    if (result.success) {
      toast.success(t.success);
      const roleRoutes: Record<UserRole, string> = { admin: '/admin', instructor: '/instructor', learner: '/learner', parent: '/parent' };
      navigate(roleRoutes[selectedRole] || from);
    } else {
      toast.error(result.message);
    }
  };

  const handleQuickLogin = async (role: UserRole) => {
    setSelectedRole(role);
    setIsLoading(true);
    const demoEmails: Record<UserRole, string> = {
      admin: 'admin@daarulhidayah.edu', instructor: 'teacher@daarulhidayah.edu',
      learner: 'student@daarulhidayah.edu', parent: 'parent@daarulhidayah.edu',
    };
    const result = await login(demoEmails[role], 'demo1234', role);
    setIsLoading(false);
    if (result.success) {
      toast.success(t.success);
      navigate(`/${role === 'learner' ? 'learner' : role}`);
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
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">{t.selectRole}</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {roleOptions.map((option) => (
                <button key={option.role} type="button" onClick={() => setSelectedRole(option.role)}
                  className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                    selectedRole === option.role ? 'border-primary bg-primary/5 shadow-soft' : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}>
                  {selectedRole === option.role && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <FiCheck className="w-3 h-3 text-primary-foreground" />
                    </span>
                  )}
                  <option.icon className={`w-5 h-5 ${selectedRole === option.role ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`text-xs font-medium ${selectedRole === option.role ? 'text-foreground' : 'text-muted-foreground'}`}>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

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

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center">
              <span className="px-4 text-xs text-muted-foreground bg-card">{t.orQuickLoginAs}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {roleOptions.map((option) => (
              <Button key={option.role} type="button" variant="outline" size="sm" onClick={() => handleQuickLogin(option.role)} disabled={isLoading} className="text-xs">
                <option.icon className="w-4 h-4 mr-1" />{option.label.split(' ')[0]}
              </Button>
            ))}
          </div>

          <p className="text-xs text-center text-muted-foreground mt-6">{t.demoModeNote}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
