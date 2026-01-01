/**
 * =============================================================================
 * SETTINGS PAGE
 * =============================================================================
 * 
 * School and user settings management.
 * =============================================================================
 */

import React, { useState } from 'react';
import { 
  FiSettings, FiUser, FiMail, FiPhone, FiMapPin, FiSave,
  FiMoon, FiSun, FiGlobe, FiLock
} from 'react-icons/fi';
import { useAuth } from '@/features/auth/AuthContext';
import { useTheme } from '@/features/app/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // School settings (mock)
  const [schoolSettings, setSchoolSettings] = useState({
    name: 'Daarul Hidayah',
    motto: 'Learn for servitude to Allah and Sincerity of Religion',
    email: 'daarulhidayahabk@gmail.com',
    phone: '08085944916',
    address: 'Ita Ika, Abeokuta, Ogun State',
    termFee: '6000',
  });

  // User settings
  const [userSettings, setUserSettings] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
  });

  const handleSaveSchool = () => {
    toast.success('School settings saved!');
  };

  const handleSaveUser = () => {
    toast.success('Profile updated!');
    setUserSettings({ ...userSettings, currentPassword: '', newPassword: '' });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage school and profile settings</p>
      </div>

      {/* Appearance */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <FiSettings className="w-5 h-5 text-primary" />
          Appearance
        </h2>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">Theme</p>
            <p className="text-sm text-muted-foreground">Choose light or dark mode</p>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          >
            {theme === 'light' ? (
              <>
                <FiSun className="w-5 h-5" />
                <span>Light</span>
              </>
            ) : (
              <>
                <FiMoon className="w-5 h-5" />
                <span>Dark</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* School Settings */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <FiGlobe className="w-5 h-5 text-primary" />
          School Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">School Name</label>
            <Input
              value={schoolSettings.name}
              onChange={(e) => setSchoolSettings({ ...schoolSettings, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Term Fee (₦)</label>
            <Input
              value={schoolSettings.termFee}
              onChange={(e) => setSchoolSettings({ ...schoolSettings, termFee: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">Motto</label>
            <Input
              value={schoolSettings.motto}
              onChange={(e) => setSchoolSettings({ ...schoolSettings, motto: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <FiMail className="w-4 h-4 inline mr-1" />
              Email
            </label>
            <Input
              type="email"
              value={schoolSettings.email}
              onChange={(e) => setSchoolSettings({ ...schoolSettings, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <FiPhone className="w-4 h-4 inline mr-1" />
              Phone
            </label>
            <Input
              value={schoolSettings.phone}
              onChange={(e) => setSchoolSettings({ ...schoolSettings, phone: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">
              <FiMapPin className="w-4 h-4 inline mr-1" />
              Address
            </label>
            <Input
              value={schoolSettings.address}
              onChange={(e) => setSchoolSettings({ ...schoolSettings, address: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <Button onClick={handleSaveSchool}>
            <FiSave className="w-4 h-4 mr-2" />
            Save School Settings
          </Button>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <FiUser className="w-5 h-5 text-primary" />
          Profile Settings
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
            <Input
              value={userSettings.name}
              onChange={(e) => setUserSettings({ ...userSettings, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <Input
              type="email"
              value={userSettings.email}
              onChange={(e) => setUserSettings({ ...userSettings, email: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <FiLock className="w-4 h-4" />
            Change Password
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Current Password</label>
              <Input
                type="password"
                value={userSettings.currentPassword}
                onChange={(e) => setUserSettings({ ...userSettings, currentPassword: e.target.value })}
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
              <Input
                type="password"
                value={userSettings.newPassword}
                onChange={(e) => setUserSettings({ ...userSettings, newPassword: e.target.value })}
                placeholder="Enter new password"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <Button onClick={handleSaveUser}>
            <FiSave className="w-4 h-4 mr-2" />
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  );
};
