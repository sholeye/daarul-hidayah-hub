/**
 * =============================================================================
 * ADMIN DASHBOARD
 * =============================================================================
 * 
 * Overview dashboard for administrators showing key metrics and recent activity.
 * =============================================================================
 */

import React from 'react';
import { 
  FiUsers, FiDollarSign, FiTrendingUp, FiAlertCircle, 
  FiCalendar, FiArrowUpRight, FiCheckCircle, FiClock
} from 'react-icons/fi';
import { mockStudents, mockAnnouncements, mockAttendance } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { Badge } from '@/components/ui/badge';

export const AdminDashboard: React.FC = () => {
  // Calculate statistics
  const totalStudents = mockStudents.length;
  const paidStudents = mockStudents.filter(s => s.feeStatus === 'paid').length;
  const totalRevenue = mockStudents.reduce((sum, s) => sum + s.amountPaid, 0);
  const pendingFees = mockStudents.reduce((sum, s) => sum + (s.totalFee - s.amountPaid), 0);
  const todayAttendance = mockAttendance.filter(a => a.status === 'present').length;

  // Stats configuration
  const stats = [
    { 
      icon: FiUsers, 
      label: 'Total Students', 
      value: totalStudents, 
      change: '+3 this month',
      gradient: 'from-primary/20 to-primary/5',
      iconColor: 'text-primary'
    },
    { 
      icon: FiDollarSign, 
      label: 'Revenue Collected', 
      value: formatCurrency(totalRevenue), 
      change: '+12% from last term',
      gradient: 'from-secondary/20 to-secondary/5',
      iconColor: 'text-secondary'
    },
    { 
      icon: FiTrendingUp, 
      label: 'Fee Completion', 
      value: `${Math.round((paidStudents / totalStudents) * 100)}%`, 
      change: `${paidStudents} of ${totalStudents} paid`,
      gradient: 'from-accent/20 to-accent/5',
      iconColor: 'text-accent'
    },
    { 
      icon: FiAlertCircle, 
      label: 'Pending Fees', 
      value: formatCurrency(pendingFees), 
      change: `${totalStudents - paidStudents} students`,
      gradient: 'from-destructive/20 to-destructive/5',
      iconColor: 'text-destructive'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your school overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <div 
            key={stat.label} 
            className="relative overflow-hidden bg-card rounded-2xl border border-border p-6 shadow-soft hover:shadow-medium transition-shadow duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50`} />
            
            <div className="relative">
              <div className={`w-12 h-12 rounded-xl bg-background flex items-center justify-center mb-4 shadow-soft`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm font-medium text-foreground mt-1">{stat.label}</p>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <FiArrowUpRight className="w-3 h-3" />
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-lg text-foreground">Recent Students</h2>
            <a href="/admin/students" className="text-sm text-primary hover:underline font-medium">
              View all
            </a>
          </div>
          <div className="space-y-4">
            {mockStudents.slice(0, 4).map((student) => (
              <div 
                key={student.id} 
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-bold text-lg">
                    {student.fullName[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{student.fullName}</p>
                  <p className="text-sm text-muted-foreground">{student.studentId}</p>
                </div>
                <Badge variant={student.feeStatus === 'paid' ? 'paid' : student.feeStatus === 'partial' ? 'partial' : 'unpaid'}>
                  {student.feeStatus}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-lg text-foreground">Announcements</h2>
            <a href="/admin/announcements" className="text-sm text-primary hover:underline font-medium">
              Manage
            </a>
          </div>
          <div className="space-y-4">
            {mockAnnouncements.slice(0, 3).map((ann) => (
              <div key={ann.id} className="p-4 rounded-xl bg-muted/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{ann.title}</p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ann.content}</p>
                  </div>
                  <Badge variant={ann.category === 'urgent' ? 'unpaid' : 'outline'} className="flex-shrink-0">
                    {ann.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                  <FiCalendar className="w-3 h-3" />
                  {formatDate(ann.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Attendance Summary */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
        <h2 className="font-semibold text-lg text-foreground mb-6">Today's Attendance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FiCheckCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{todayAttendance}</p>
              <p className="text-sm text-muted-foreground">Present</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/5">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <FiClock className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {mockAttendance.filter(a => a.status === 'late').length}
              </p>
              <p className="text-sm text-muted-foreground">Late</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-destructive/5">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <FiAlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {mockAttendance.filter(a => a.status === 'absent').length}
              </p>
              <p className="text-sm text-muted-foreground">Absent</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
