/**
 * =============================================================================
 * ATTENDANCE MANAGEMENT PAGE
 * =============================================================================
 * 
 * List-based attendance tracking with checkbox marking system.
 * =============================================================================
 */

import React, { useState } from 'react';
import { 
  FiCheckCircle, FiClock, FiXCircle, FiCalendar,
  FiSearch, FiUser, FiSave, FiCheck
} from 'react-icons/fi';
import { mockStudents, mockAttendance, schoolClasses } from '@/data/mockData';
import { AttendanceRecord } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

// ---------------------------------------------------------------------------
// Main Attendance Page Component
// ---------------------------------------------------------------------------
export const AttendancePage: React.FC = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendance);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');

  // Get attendance for selected date
  const dateAttendance = attendance.filter(a => a.date === selectedDate);
  const presentCount = dateAttendance.filter(a => a.status === 'present').length;
  const lateCount = dateAttendance.filter(a => a.status === 'late').length;
  const absentCount = dateAttendance.filter(a => a.status === 'absent').length;

  // Filter students by class and search
  const filteredStudents = mockStudents
    .filter(s => selectedClass === 'all' || s.class === selectedClass)
    .filter(s => s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 s.studentId.toLowerCase().includes(searchQuery.toLowerCase()));

  // Get student attendance status for selected date
  const getStudentStatus = (studentId: string): 'present' | 'absent' | 'late' | null => {
    const record = dateAttendance.find(a => a.studentId === studentId);
    if (!record) return null;
    if (record.status === 'excused') return 'absent';
    return record.status;
  };

  // Toggle attendance status
  const toggleAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    const existingIndex = attendance.findIndex(
      a => a.studentId === studentId && a.date === selectedDate
    );

    if (existingIndex >= 0) {
      // Update existing record
      setAttendance(attendance.map((a, i) => 
        i === existingIndex ? { ...a, status } : a
      ));
    } else {
      // Create new record
      const newRecord: AttendanceRecord = {
        id: Date.now().toString(),
        studentId,
        date: selectedDate,
        status,
        checkInTime: status !== 'absent' ? new Date().toTimeString().slice(0, 5) : undefined,
      };
      setAttendance([...attendance, newRecord]);
    }
  };

  // Mark all as present
  const markAllPresent = () => {
    const newRecords = filteredStudents
      .filter(s => !getStudentStatus(s.studentId))
      .map(s => ({
        id: Date.now().toString() + s.studentId,
        studentId: s.studentId,
        date: selectedDate,
        status: 'present' as const,
        checkInTime: new Date().toTimeString().slice(0, 5),
      }));

    if (newRecords.length > 0) {
      setAttendance([...attendance, ...newRecords]);
      toast.success(`Marked ${newRecords.length} students as present`);
    } else {
      toast.info('All students already have attendance marked');
    }
  };

  // Save attendance (mock)
  const saveAttendance = () => {
    toast.success('Attendance saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Attendance</h1>
          <p className="text-muted-foreground mt-1">Mark and manage student attendance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllPresent}>
            <FiCheck className="w-4 h-4 mr-2" />
            Mark All Present
          </Button>
          <Button onClick={saveAttendance} className="btn-glow">
            <FiSave className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <FiCheckCircle className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{presentCount}</p>
            <p className="text-sm text-muted-foreground">Present</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
            <FiClock className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{lateCount}</p>
            <p className="text-sm text-muted-foreground">Late</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
            <FiXCircle className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{absentCount}</p>
            <p className="text-sm text-muted-foreground">Absent</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
            <FiUser className="w-6 h-6 text-accent-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{filteredStudents.length}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students..."
            className="pl-12"
          />
        </div>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="h-10 px-4 rounded-lg border border-input bg-background text-foreground"
        >
          <option value="all">All Classes</option>
          {schoolClasses.map(c => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
        <div className="relative">
          <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="pl-12 w-full sm:w-48"
          />
        </div>
      </div>

      {/* Attendance List with Checkboxes */}
      <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Student</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Class</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-foreground">
                  <div className="flex items-center justify-center gap-1">
                    <FiCheckCircle className="w-4 h-4 text-primary" />
                    Present
                  </div>
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-foreground">
                  <div className="flex items-center justify-center gap-1">
                    <FiClock className="w-4 h-4 text-secondary" />
                    Late
                  </div>
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-foreground">
                  <div className="flex items-center justify-center gap-1">
                    <FiXCircle className="w-4 h-4 text-destructive" />
                    Absent
                  </div>
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStudents.map((student) => {
                const status = getStudentStatus(student.studentId);
                return (
                  <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-foreground font-bold">{student.fullName[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{student.fullName}</p>
                          <p className="text-sm text-muted-foreground">{student.studentId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{student.class}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={status === 'present'}
                          onCheckedChange={() => toggleAttendance(student.studentId, 'present')}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={status === 'late'}
                          onCheckedChange={() => toggleAttendance(student.studentId, 'late')}
                          className="data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={status === 'absent'}
                          onCheckedChange={() => toggleAttendance(student.studentId, 'absent')}
                          className="data-[state=checked]:bg-destructive data-[state=checked]:border-destructive"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {status ? (
                        <Badge variant={
                          status === 'present' ? 'present' :
                          status === 'late' ? 'late' : 'absent'
                        }>
                          {status}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not marked</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="p-12 text-center">
            <FiUser className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No students found</p>
          </div>
        )}
      </div>
    </div>
  );
};
