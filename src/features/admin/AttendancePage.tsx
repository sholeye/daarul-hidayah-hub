/**
 * =============================================================================
 * ATTENDANCE MANAGEMENT PAGE
 * =============================================================================
 * 
 * Efficient attendance tracking - updates on checkbox click.
 * Only Present/Absent status (no Late option).
 * Shows past attendance for selected dates, disables future dates.
 * =============================================================================
 */

import React, { useState, useCallback, useMemo } from 'react';
import { 
  FiCheckCircle, FiXCircle, FiCalendar,
  FiSearch, FiUser, FiCheck
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
  const today = new Date().toISOString().split('T')[0];
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendance);
  const [selectedDate, setSelectedDate] = useState(today);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');

  // Check if selected date is in the future
  const isFutureDate = useMemo(() => selectedDate > today, [selectedDate, today]);
  const isToday = useMemo(() => selectedDate === today, [selectedDate, today]);

  // Get attendance for selected date
  const dateAttendance = useMemo(() => 
    attendance.filter(a => a.date === selectedDate),
    [attendance, selectedDate]
  );

  const presentCount = dateAttendance.filter(a => a.status === 'present').length;
  const absentCount = dateAttendance.filter(a => a.status === 'absent').length;

  // Filter students by class and search
  const filteredStudents = useMemo(() => 
    mockStudents
      .filter(s => selectedClass === 'all' || s.class === selectedClass)
      .filter(s => s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   s.studentId.toLowerCase().includes(searchQuery.toLowerCase())),
    [selectedClass, searchQuery]
  );

  // Get student attendance status for selected date
  const getStudentStatus = useCallback((studentId: string): 'present' | 'absent' | null => {
    const record = dateAttendance.find(a => a.studentId === studentId);
    if (!record) return null;
    // Convert any non-present status to absent
    return record.status === 'present' ? 'present' : 'absent';
  }, [dateAttendance]);

  // Toggle attendance status - immediately updates (simulates DB update)
  const toggleAttendance = useCallback((studentId: string, status: 'present' | 'absent') => {
    if (isFutureDate) {
      toast.error('Cannot mark attendance for future dates');
      return;
    }

    const existingIndex = attendance.findIndex(
      a => a.studentId === studentId && a.date === selectedDate
    );

    let newAttendance: AttendanceRecord[];

    if (existingIndex >= 0) {
      // Update existing record
      newAttendance = attendance.map((a, i) => 
        i === existingIndex ? { ...a, status, checkInTime: status === 'present' ? new Date().toTimeString().slice(0, 5) : undefined } : a
      );
    } else {
      // Create new record
      const newRecord: AttendanceRecord = {
        id: Date.now().toString(),
        studentId,
        date: selectedDate,
        status,
        checkInTime: status === 'present' ? new Date().toTimeString().slice(0, 5) : undefined,
      };
      newAttendance = [...attendance, newRecord];
    }

    setAttendance(newAttendance);
    
    // Simulated DB update (would be replaced with actual Supabase call)
    // This is efficient - only one record updated at a time
    const student = mockStudents.find(s => s.studentId === studentId);
    toast.success(`${student?.fullName || 'Student'} marked as ${status}`, {
      duration: 1500,
    });
  }, [attendance, selectedDate, isFutureDate]);

  // Mark all as present
  const markAllPresent = useCallback(() => {
    if (isFutureDate) {
      toast.error('Cannot mark attendance for future dates');
      return;
    }

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
      setAttendance(prev => [...prev, ...newRecords]);
      toast.success(`Marked ${newRecords.length} students as present`);
    } else {
      toast.info('All students already have attendance marked');
    }
  }, [filteredStudents, getStudentStatus, selectedDate, isFutureDate]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Attendance</h1>
          <p className="text-muted-foreground mt-1">
            {isToday ? 'Mark attendance for today' : isFutureDate ? 'Viewing future date (read-only)' : 'Viewing past attendance'}
          </p>
        </div>
        {isToday && (
          <Button variant="outline" onClick={markAllPresent}>
            <FiCheck className="w-4 h-4 mr-2" />
            Mark All Present
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
            max={today}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="pl-12 w-full sm:w-48"
          />
        </div>
      </div>

      {/* Future Date Warning */}
      {isFutureDate && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-center">
          <p className="text-destructive font-medium">Cannot mark attendance for future dates</p>
        </div>
      )}

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
                          disabled={isFutureDate}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={status === 'absent'}
                          onCheckedChange={() => toggleAttendance(student.studentId, 'absent')}
                          disabled={isFutureDate}
                          className="data-[state=checked]:bg-destructive data-[state=checked]:border-destructive"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {status ? (
                        <Badge variant={status === 'present' ? 'present' : 'absent'}>
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
