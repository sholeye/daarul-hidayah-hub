/**
 * =============================================================================
 * ADMIN LAYOUT - with i18n support
 * =============================================================================
 */

import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, FiUsers, FiCalendar, FiDollarSign, FiFileText, 
  FiBell, FiSettings, FiLogOut, FiMenu, FiX, FiMoon, FiSun, FiAward 
} from 'react-icons/fi';
import { useAuth } from '@/features/auth/AuthContext';
import { useTheme } from '@/features/app/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, isRTL } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Navigation items with translations
  const navItems = [
    { icon: FiHome, label: t.dashboard, path: '/admin' },
    { icon: FiUsers, label: t.students, path: '/admin/students' },
    { icon: FiCalendar, label: t.attendance, path: '/admin/attendance' },
    { icon: FiDollarSign, label: t.finance, path: '/admin/finance' },
    { icon: FiFileText, label: t.results, path: '/admin/results' },
    { icon: FiAward, label: t.quiz, path: '/admin/quiz' },
    { icon: FiBell, label: t.announcements, path: '/admin/announcements' },
    { icon: FiSettings, label: t.settings, path: '/admin/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-background flex w-full">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-50 w-72 bg-sidebar transform transition-transform duration-300 ease-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo section */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sidebar-primary to-sidebar-primary/80 flex items-center justify-center shadow-lg">
                <span className="text-sidebar-primary-foreground font-bold text-xl">د</span>
              </div>
              <div>
                <h1 className="font-bold text-lg text-sidebar-foreground">{t.schoolName}</h1>
                <p className="text-xs text-sidebar-foreground/60">{t.adminPortal}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-soft'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-sidebar-primary' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-sidebar-accent/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sidebar-primary to-sidebar-primary/80 flex items-center justify-center">
                <span className="text-sidebar-primary-foreground font-bold">{user?.name?.[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
                <p className="text-xs text-sidebar-foreground/60 capitalize">{user?.role}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent" 
              onClick={handleLogout}
            >
              <FiLogOut className="w-4 h-4 mr-2" />
              {t.signOut}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 ${isRTL ? 'lg:mr-72' : 'lg:ml-72'} min-h-screen flex flex-col`}>
        {/* Header */}
        <header className="sticky top-0 z-40 h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center px-4 lg:px-8">
          <button 
            className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
          
          <div className="flex-1" />
          
          {/* Theme toggle */}
          <button 
            onClick={toggleTheme} 
            className="p-2.5 rounded-xl hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <FiMoon className="w-5 h-5 text-foreground" />
            ) : (
              <FiSun className="w-5 h-5 text-foreground" />
            )}
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
    </div>
  );
};
