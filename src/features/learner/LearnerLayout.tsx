/**
 * =============================================================================
 * LEARNER LAYOUT
 * =============================================================================
 * 
 * Main layout wrapper for the student/learner dashboard with navigation.
 * =============================================================================
 */

import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  FiHome, FiUser, FiCalendar, FiFileText, FiDollarSign,
  FiLogOut, FiMoon, FiSun, FiMenu, FiX
} from 'react-icons/fi';
import { useAuth } from '@/features/auth/AuthContext';
import { useTheme } from '@/features/app/ThemeContext';

// ---------------------------------------------------------------------------
// Navigation Items
// ---------------------------------------------------------------------------
const navItems = [
  { icon: FiHome, label: 'Dashboard', path: '/learner' },
  { icon: FiUser, label: 'Profile', path: '/learner/profile' },
  { icon: FiCalendar, label: 'Attendance', path: '/learner/attendance' },
  { icon: FiFileText, label: 'Results', path: '/learner/results' },
  { icon: FiDollarSign, label: 'Fees', path: '/learner/fees' },
];

// ---------------------------------------------------------------------------
// Main Layout Component
// ---------------------------------------------------------------------------
export const LearnerLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-40 px-4 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <FiMenu className="w-6 h-6" />
        </button>
        <span className="font-semibold text-foreground">Student Portal</span>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-50
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-border">
          <div>
            <h1 className="font-bold text-foreground">Daarul Hidayah</h1>
            <p className="text-xs text-muted-foreground">Student Portal</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/learner'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-primary text-primary-foreground shadow-soft' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <span className="text-primary-foreground font-bold">{user?.name?.[0] || 'S'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{user?.name || 'Student'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleTheme}
              className="flex-1 p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground hidden lg:flex items-center justify-center"
            >
              {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 p-2 rounded-lg hover:bg-destructive/10 transition-colors text-destructive flex items-center justify-center gap-2"
            >
              <FiLogOut className="w-5 h-5" />
              <span className="lg:hidden">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
