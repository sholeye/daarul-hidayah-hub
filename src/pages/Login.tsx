import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      toast.success('Login successful! Redirecting...');
      // Redirect based on role
      const storedUser = localStorage.getItem('daarul_hidayah_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        switch (user.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'instructor':
            navigate('/instructor');
            break;
          case 'learner':
            navigate('/learner');
            break;
          default:
            navigate(from);
        }
      }
    } else {
      toast.error(result.message);
    }
  };

  const demoCredentials = [
    { role: 'Admin', email: 'admin@daarulhidayah.edu', password: '1234' },
    { role: 'Teacher', email: 'teacher@daarulhidayah.edu', password: '1234' },
    { role: 'Student', email: 'student@daarulhidayah.edu', password: '1234' },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 islamic-pattern">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-2xl">D</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Daarul Hidayah</h1>
          <p className="text-muted-foreground text-sm mt-1">Student Portal Login</p>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-2xl border border-border shadow-soft p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
              <FiLogIn className="w-4 h-4" />
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-4">Demo Credentials (any password works)</p>
            <div className="space-y-2">
              {demoCredentials.map((cred) => (
                <button
                  key={cred.role}
                  onClick={() => {
                    setEmail(cred.email);
                    setPassword(cred.password);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm"
                >
                  <span className="font-medium text-foreground">{cred.role}</span>
                  <span className="text-muted-foreground text-xs">{cred.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <p className="text-center mt-6">
          <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Back to Home
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
