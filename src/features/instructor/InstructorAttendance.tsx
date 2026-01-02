/**
 * =============================================================================
 * INSTRUCTOR ATTENDANCE PAGE - List-based marking
 * =============================================================================
 */

import React, { useState } from 'react';
import { FiCheckCircle, FiClock, FiXCircle, FiCalendar, FiSave } from 'react-icons/fi';
import { mockStudents, schoolClasses } from '@/data/mockData';
import { AttendanceRecord } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

export const InstructorAttendance: React.FC = () => {
  const assignedClasses = schoolClasses.slice(0, 2);
  const [selectedClass, setSelectedClass] = useState(assignedClasses[0]?.name || '');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'late' | 'absent'>>({});

  const students = mockStudents.filter(s => s.class === selectedClass);

  const toggleAttendance = (studentId: string, status: 'present' | 'late' | 'absent') => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = () => { toast.success('Attendance saved successfully!'); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl sm:text-3xl font-bold text-foreground">Mark Attendance</h1><p className="text-muted-foreground mt-1">Select a class and mark attendance</p></div>
        <Button onClick={saveAttendance} className="btn-glow"><FiSave className="w-4 h-4 mr-2" />Save</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="h-10 px-4 rounded-lg border border-input bg-background text-foreground">
          {assignedClasses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
        <div className="relative"><FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /><Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="pl-12 w-full sm:w-48" /></div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Student</th>
              <th className="text-center px-6 py-4 text-sm font-semibold text-foreground">Present</th>
              <th className="text-center px-6 py-4 text-sm font-semibold text-foreground">Late</th>
              <th className="text-center px-6 py-4 text-sm font-semibold text-foreground">Absent</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-muted/30">
                <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center"><span className="text-primary-foreground font-bold">{student.fullName[0]}</span></div><div><p className="font-medium text-foreground">{student.fullName}</p><p className="text-sm text-muted-foreground">{student.studentId}</p></div></div></td>
                <td className="px-6 py-4 text-center"><Checkbox checked={attendance[student.studentId] === 'present'} onCheckedChange={() => toggleAttendance(student.studentId, 'present')} /></td>
                <td className="px-6 py-4 text-center"><Checkbox checked={attendance[student.studentId] === 'late'} onCheckedChange={() => toggleAttendance(student.studentId, 'late')} /></td>
                <td className="px-6 py-4 text-center"><Checkbox checked={attendance[student.studentId] === 'absent'} onCheckedChange={() => toggleAttendance(student.studentId, 'absent')} /></td>
                <td className="px-6 py-4">{attendance[student.studentId] ? <Badge variant={attendance[student.studentId] === 'present' ? 'present' : attendance[student.studentId] === 'late' ? 'late' : 'absent'}>{attendance[student.studentId]}</Badge> : <span className="text-muted-foreground text-sm">Not marked</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
