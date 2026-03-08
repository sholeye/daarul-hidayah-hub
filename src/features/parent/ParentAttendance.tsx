/**
 * Parent Attendance - View children's attendance records
 */

import React, { useState } from 'react';
import { FiCalendar, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import { mockStudents, mockAttendance } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/helpers';

export const ParentAttendance: React.FC = () => {
  const myChildren = mockStudents.slice(0, 2);
  const [selectedChild, setSelectedChild] = useState(myChildren[0]?.studentId || '');

  const childAttendance = mockAttendance
    .filter(a => a.studentId === selectedChild)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const presentCount = childAttendance.filter(a => a.status === 'present').length;
  const absentCount = childAttendance.filter(a => a.status === 'absent').length;
  const lateCount = childAttendance.filter(a => a.status === 'late').length;
  const total = childAttendance.length || 1;
  const rate = Math.round(((presentCount + lateCount) / total) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Attendance</h1>
        <p className="text-muted-foreground mt-1">View your children's attendance records</p>
      </div>

      {/* Child Selector */}
      <div className="flex gap-3">
        {myChildren.map(child => (
          <button key={child.studentId} onClick={() => setSelectedChild(child.studentId)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${selectedChild === child.studentId ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
            {child.fullName.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <FiCheckCircle className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">{presentCount}</p>
          <p className="text-sm text-muted-foreground">Present</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <FiClock className="w-5 h-5 text-secondary mb-2" />
          <p className="text-2xl font-bold text-foreground">{lateCount}</p>
          <p className="text-sm text-muted-foreground">Late</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <FiXCircle className="w-5 h-5 text-destructive mb-2" />
          <p className="text-2xl font-bold text-foreground">{absentCount}</p>
          <p className="text-sm text-muted-foreground">Absent</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <FiCalendar className="w-5 h-5 text-accent-foreground mb-2" />
          <p className="text-2xl font-bold text-foreground">{rate}%</p>
          <p className="text-sm text-muted-foreground">Rate</p>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Day</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Check-in</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {childAttendance.map(record => (
                <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{formatDate(record.date)}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}</td>
                  <td className="px-6 py-4"><Badge variant={record.status === 'present' ? 'present' : record.status === 'late' ? 'late' : 'absent'}>{record.status}</Badge></td>
                  <td className="px-6 py-4 text-sm text-foreground">{record.checkInTime || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {childAttendance.length === 0 && (
          <div className="p-12 text-center"><FiCalendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" /><p className="text-muted-foreground">No attendance records</p></div>
        )}
      </div>
    </div>
  );
};
