import React from 'react';
import { FiUsers, FiDollarSign, FiCalendar, FiFileText, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
import { mockStudents, mockAnnouncements } from '@/data/mockData';
import { formatCurrency } from '@/utils/helpers';

export const AdminDashboard: React.FC = () => {
  const totalStudents = mockStudents.length;
  const paidStudents = mockStudents.filter(s => s.feeStatus === 'paid').length;
  const totalRevenue = mockStudents.reduce((sum, s) => sum + s.amountPaid, 0);
  const pendingFees = mockStudents.reduce((sum, s) => sum + (s.totalFee - s.amountPaid), 0);

  const stats = [
    { icon: FiUsers, label: 'Total Students', value: totalStudents, color: 'bg-primary/10 text-primary' },
    { icon: FiDollarSign, label: 'Revenue Collected', value: formatCurrency(totalRevenue), color: 'bg-primary/10 text-primary' },
    { icon: FiTrendingUp, label: 'Fee Completion', value: `${Math.round((paidStudents / totalStudents) * 100)}%`, color: 'bg-secondary/10 text-secondary' },
    { icon: FiAlertCircle, label: 'Pending Fees', value: formatCurrency(pendingFees), color: 'bg-destructive/10 text-destructive' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Administrator</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl border border-border p-5 shadow-soft">
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Students & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-foreground mb-4">Recent Students</h2>
          <div className="space-y-3">
            {mockStudents.slice(0, 5).map((student) => (
              <div key={student.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">{student.fullName[0]}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{student.fullName}</p>
                  <p className="text-xs text-muted-foreground">{student.studentId} • {student.class}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-foreground mb-4">Announcements</h2>
          <div className="space-y-3">
            {mockAnnouncements.slice(0, 3).map((ann) => (
              <div key={ann.id} className="p-3 rounded-lg bg-muted/50">
                <p className="font-medium text-foreground">{ann.title}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
