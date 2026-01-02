/**
 * =============================================================================
 * INSTRUCTOR DASHBOARD
 * =============================================================================
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiCalendar, FiFileText, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '@/features/auth/AuthContext';
import { mockStudents, schoolClasses } from '@/data/mockData';

export const InstructorDashboard: React.FC = () => {
  const { user } = useAuth();
  const assignedClasses = schoolClasses.slice(0, 2); // Mock assigned classes
  const totalStudents = mockStudents.filter(s => assignedClasses.some(c => c.name === s.class)).length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground">
        <h1 className="text-2xl sm:text-3xl font-bold">Assalamu Alaikum, {user?.name?.split(' ')[0]}</h1>
        <p className="mt-2 opacity-90">Manage your classes and students.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><FiUsers className="w-6 h-6 text-primary" /></div>
          <div><p className="text-2xl font-bold text-foreground">{assignedClasses.length}</p><p className="text-sm text-muted-foreground">Classes</p></div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center"><FiUsers className="w-6 h-6 text-secondary" /></div>
          <div><p className="text-2xl font-bold text-foreground">{totalStudents}</p><p className="text-sm text-muted-foreground">Students</p></div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center"><FiFileText className="w-6 h-6 text-accent-foreground" /></div>
          <div><p className="text-2xl font-bold text-foreground">0</p><p className="text-sm text-muted-foreground">Pending Results</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Link to="/instructor/attendance" className="bg-card rounded-2xl border border-border p-6 hover:shadow-soft transition-shadow">
          <div className="flex items-center justify-between"><h3 className="font-semibold text-foreground">Mark Attendance</h3><FiArrowRight className="w-5 h-5 text-muted-foreground" /></div>
          <p className="text-sm text-muted-foreground mt-2">Mark attendance for your assigned classes</p>
        </Link>
        <Link to="/instructor/results" className="bg-card rounded-2xl border border-border p-6 hover:shadow-soft transition-shadow">
          <div className="flex items-center justify-between"><h3 className="font-semibold text-foreground">Enter Results</h3><FiArrowRight className="w-5 h-5 text-muted-foreground" /></div>
          <p className="text-sm text-muted-foreground mt-2">Enter scores for students in your classes</p>
        </Link>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">My Classes</h3>
        <div className="space-y-3">
          {assignedClasses.map(c => (
            <div key={c.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div><p className="font-medium text-foreground">{c.name}</p><p className="text-sm text-muted-foreground">{c.nameArabic}</p></div>
              <span className="text-sm text-muted-foreground">{c.studentCount} students</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
