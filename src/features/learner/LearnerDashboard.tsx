/**
 * Learner Dashboard - Shared state
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiCalendar, FiFileText, FiDollarSign, FiCheckCircle, FiXCircle, FiClock, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '@/features/auth/AuthContext';
import { useSharedData } from '@/contexts/SharedDataContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, formatCurrency } from '@/utils/helpers';

export const LearnerDashboard: React.FC = () => {
  const { getStudentByUserId } = useAuth();
  const { students, results, attendance, announcements } = useSharedData();
  const student = getStudentByUserId();
  const currentStudent = student || students[0];
  const studentResult = results.find(r => r.studentId === currentStudent?.studentId);

  const studentAttendance = attendance.filter(a => a.studentId === currentStudent?.studentId);
  const presentDays = studentAttendance.filter(a => a.status === 'present').length;
  const lateDays = studentAttendance.filter(a => a.status === 'late').length;
  const absentDays = studentAttendance.filter(a => a.status === 'absent').length;
  const totalDays = studentAttendance.length || 1;
  const attendancePercentage = Math.round(((presentDays + lateDays) / totalDays) * 100);

  const activeAnnouncements = announcements.filter(a => a.isActive).slice(0, 3);
  const feesPaid = currentStudent?.feeStatus === 'paid';
  const feeBalance = currentStudent ? currentStudent.totalFee - currentStudent.amountPaid : 0;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground">
        <h1 className="text-2xl sm:text-3xl font-bold">Assalamu Alaikum, {currentStudent?.fullName?.split(' ')[0]}</h1>
        <p className="mt-2 opacity-90">Welcome to your student portal. Here&apos;s your overview.</p>
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="bg-primary-foreground/20 rounded-lg px-4 py-2"><span className="text-sm opacity-75">Student ID</span><p className="font-semibold">{currentStudent?.studentId}</p></div>
          <div className="bg-primary-foreground/20 rounded-lg px-4 py-2"><span className="text-sm opacity-75">Class</span><p className="font-semibold">{currentStudent?.class}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4"><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><FiCalendar className="w-5 h-5 text-primary" /></div><span className="text-sm text-muted-foreground">Attendance</span></div><p className="text-2xl font-bold text-foreground">{attendancePercentage}%</p><div className="flex gap-2 mt-2 text-xs"><span className="text-primary">{presentDays} present</span><span className="text-secondary">{lateDays} late</span></div></div>
        <div className="bg-card rounded-xl border border-border p-4"><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center"><FiFileText className="w-5 h-5 text-secondary" /></div><span className="text-sm text-muted-foreground">Average</span></div><p className="text-2xl font-bold text-foreground">{studentResult ? `${studentResult.averageScore.toFixed(1)}%` : 'N/A'}</p><p className="text-xs text-muted-foreground mt-2">{studentResult ? `Position: ${studentResult.position}` : 'No result yet'}</p></div>
        <div className="bg-card rounded-xl border border-border p-4"><div className="flex items-center gap-3 mb-3"><div className={`w-10 h-10 rounded-lg flex items-center justify-center ${feesPaid ? 'bg-primary/10' : 'bg-destructive/10'}`}><FiDollarSign className={`w-5 h-5 ${feesPaid ? 'text-primary' : 'text-destructive'}`} /></div><span className="text-sm text-muted-foreground">Fee Status</span></div><Badge variant={currentStudent?.feeStatus === 'paid' ? 'paid' : 'unpaid'}>{currentStudent?.feeStatus}</Badge><p className="text-xs text-muted-foreground mt-2">{feeBalance > 0 ? `Balance: ${formatCurrency(feeBalance)}` : 'Fully paid'}</p></div>
        <div className="bg-card rounded-xl border border-border p-4"><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center"><FiUser className="w-5 h-5 text-accent-foreground" /></div><span className="text-sm text-muted-foreground">Profile</span></div><p className="text-sm font-medium text-foreground truncate">{currentStudent?.fullName}</p><p className="text-xs text-muted-foreground mt-2">{currentStudent?.email}</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-4"><h2 className="font-semibold text-foreground">Academic Result</h2>{studentResult && <Badge variant={feesPaid ? 'paid' : 'unpaid'}>{feesPaid ? 'Unlocked' : 'Locked'}</Badge>}</div>
          {studentResult ? (<>
            <div className="flex items-center gap-4 mb-4"><div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center"><span className="text-2xl font-bold text-primary-foreground">{studentResult.averageScore.toFixed(0)}%</span></div><div><p className="font-medium text-foreground">{studentResult.term} - {studentResult.session}</p><p className="text-sm text-muted-foreground">Position: {studentResult.position}</p></div></div>
            {feesPaid ? <Link to="/learner/results"><Button className="w-full"><FiFileText className="w-4 h-4 mr-2" />View Full Result<FiArrowRight className="w-4 h-4 ml-2" /></Button></Link> : <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center"><FiXCircle className="w-8 h-8 mx-auto text-destructive mb-2" /><p className="text-sm text-destructive font-medium">Result Locked - Fees Not Paid</p><p className="text-xs text-muted-foreground mt-1">Please complete your fee payment to access your result.</p></div>}
          </>) : <div className="bg-muted/50 rounded-lg p-6 text-center"><FiFileText className="w-10 h-10 mx-auto text-muted-foreground mb-2" /><p className="text-muted-foreground">No results available yet</p></div>}
        </div>

        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="font-semibold text-foreground mb-4">Recent Announcements</h2>
          {activeAnnouncements.length > 0 ? <div className="space-y-3">{activeAnnouncements.map(ann => (
            <div key={ann.id} className="p-3 rounded-lg bg-muted/50 border border-border"><div className="flex items-start justify-between gap-2"><h3 className="font-medium text-foreground text-sm">{ann.title}</h3><Badge variant={ann.category === 'urgent' ? 'absent' : ann.category === 'academic' ? 'paid' : 'default'}>{ann.category}</Badge></div><p className="text-xs text-muted-foreground mt-1 line-clamp-2">{ann.content}</p><p className="text-xs text-muted-foreground mt-2">{formatDate(ann.createdAt)}</p></div>
          ))}</div> : <div className="bg-muted/50 rounded-lg p-6 text-center"><p className="text-muted-foreground">No announcements</p></div>}
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-4"><h2 className="font-semibold text-foreground">Attendance Summary</h2><Link to="/learner/attendance"><Button variant="outline" size="sm">View All<FiArrowRight className="w-4 h-4 ml-2" /></Button></Link></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-primary/10"><FiCheckCircle className="w-6 h-6 mx-auto text-primary mb-2" /><p className="text-2xl font-bold text-foreground">{presentDays}</p><p className="text-xs text-muted-foreground">Days Present</p></div>
          <div className="text-center p-4 rounded-lg bg-secondary/10"><FiClock className="w-6 h-6 mx-auto text-secondary mb-2" /><p className="text-2xl font-bold text-foreground">{lateDays}</p><p className="text-xs text-muted-foreground">Days Late</p></div>
          <div className="text-center p-4 rounded-lg bg-destructive/10"><FiXCircle className="w-6 h-6 mx-auto text-destructive mb-2" /><p className="text-2xl font-bold text-foreground">{absentDays}</p><p className="text-xs text-muted-foreground">Days Absent</p></div>
        </div>
      </div>
    </div>
  );
};
