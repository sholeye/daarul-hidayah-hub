/**
 * =============================================================================
 * INSTRUCTOR LAYOUT
 * =============================================================================
 */

import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiCalendar, FiFileText, FiLogOut, FiMoon, FiSun, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '@/features/auth/AuthContext';
import { useTheme } from '@/features/app/ThemeContext';

const navItems = [
  { icon: FiHome, label: 'Dashboard', path: '/instructor' },
  { icon: FiUsers, label: 'My Classes', path: '/instructor/classes' },
  { icon: FiCalendar, label: 'Attendance', path: '/instructor/attendance' },
  { icon: FiFileText, label: 'Results', path: '/instructor/results' },
];

export const InstructorLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-background">
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-40 px-4 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-muted"><FiMenu className="w-6 h-6" /></button>
        <span className="font-semibold text-foreground">Instructor Portal</span>
        <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-muted">{theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}</button>
      </header>
      {sidebarOpen && <div className="lg:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-50 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 px-6 flex items-center justify-between border-b border-border">
          <div><h1 className="font-bold text-foreground">Daarul Hidayah</h1><p className="text-xs text-muted-foreground">Instructor Portal</p></div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-lg hover:bg-muted"><FiX className="w-5 h-5" /></button>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === '/instructor'} onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-primary text-primary-foreground shadow-soft' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
              <item.icon className="w-5 h-5" /><span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center"><span className="text-primary-foreground font-bold">{user?.name?.[0] || 'I'}</span></div>
            <div className="flex-1 min-w-0"><p className="font-medium text-foreground truncate">{user?.name || 'Instructor'}</p><p className="text-xs text-muted-foreground truncate">{user?.email}</p></div>
          </div>
          <button onClick={handleLogout} className="w-full p-2 rounded-lg hover:bg-destructive/10 text-destructive flex items-center justify-center gap-2"><FiLogOut className="w-5 h-5" /><span>Logout</span></button>
        </div>
      </aside>
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen"><div className="p-6 lg:p-8"><Outlet /></div></main>
    </div>
  );
};
