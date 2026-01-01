/**
 * =============================================================================
 * ATTENDANCE MANAGEMENT PAGE
 * =============================================================================
 * 
 * QR-based attendance tracking with scan simulation and records management.
 * =============================================================================
 */

import React, { useState } from 'react';
import { 
  FiCamera, FiCheckCircle, FiClock, FiXCircle, FiCalendar,
  FiSearch, FiUser, FiRefreshCw
} from 'react-icons/fi';
import { mockStudents, mockAttendance } from '@/data/mockData';
import { Student, AttendanceRecord } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { formatDate } from '@/utils/helpers';

export const AttendancePage: React.FC = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendance);
  const [scanMode, setScanMode] = useState(false);
  const [scannedId, setScannedId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');

  // Get today's attendance
  const todayAttendance = attendance.filter(a => a.date === selectedDate);
  const presentCount = todayAttendance.filter(a => a.status === 'present').length;
  const lateCount = todayAttendance.filter(a => a.status === 'late').length;
  const absentCount = mockStudents.length - presentCount - lateCount;

  // Simulate QR scan
  const handleScan = () => {
    const student = mockStudents.find(s => 
      s.studentId.toLowerCase() === scannedId.toLowerCase()
    );

    if (!student) {
      toast.error('Student not found!');
      return;
    }

    // Check if already marked
    const existing = attendance.find(a => 
      a.studentId === student.studentId && a.date === selectedDate
    );

    if (existing) {
      toast.warning(`${student.fullName} already marked as ${existing.status}`);
      return;
    }

    // Determine status based on time (mock)
    const now = new Date();
    const hour = now.getHours();
    const status = hour < 8 ? 'present' : hour < 9 ? 'late' : 'present';
    const checkInTime = now.toTimeString().slice(0, 5);

    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      studentId: student.studentId,
      date: selectedDate,
      status,
      checkInTime,
    };

    setAttendance([newRecord, ...attendance]);
    setScannedId('');
    toast.success(`${student.fullName} marked as ${status}`);
  };

  // Mark attendance manually
  const markAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    const existing = attendance.find(a => 
      a.studentId === studentId && a.date === selectedDate
    );

    if (existing) {
      setAttendance(attendance.map(a => 
        a.id === existing.id ? { ...a, status } : a
      ));
    } else {
      const newRecord: AttendanceRecord = {
        id: Date.now().toString(),
        studentId,
        date: selectedDate,
        status,
        checkInTime: status !== 'absent' ? new Date().toTimeString().slice(0, 5) : undefined,
      };
      setAttendance([newRecord, ...attendance]);
    }
    toast.success('Attendance updated');
  };

  // Filter students for display
  const studentsWithAttendance = mockStudents
    .filter(s => s.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
    .map(student => {
      const record = todayAttendance.find(a => a.studentId === student.studentId);
      return { ...student, attendanceStatus: record?.status || null, checkInTime: record?.checkInTime };
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Attendance</h1>
          <p className="text-muted-foreground mt-1">Track and manage student attendance</p>
        </div>
        <Button 
          onClick={() => setScanMode(!scanMode)} 
          variant={scanMode ? 'secondary' : 'default'}
          className={scanMode ? '' : 'btn-glow'}
        >
          <FiCamera className="w-4 h-4 mr-2" />
          {scanMode ? 'Close Scanner' : 'Scan QR Code'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
            <FiUser className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{mockStudents.length}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
        </div>
      </div>

      {/* QR Scanner Simulation */}
      {scanMode && (
        <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <FiCamera className="w-5 h-5 text-primary" />
            QR Code Scanner (Simulation)
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                value={scannedId}
                onChange={(e) => setScannedId(e.target.value)}
                placeholder="Enter student ID (e.g., Kathir_001)"
                className="h-12"
              />
            </div>
            <Button onClick={handleScan} className="h-12">
              <FiCheckCircle className="w-4 h-4 mr-2" />
              Mark Present
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            In production, this would use the device camera to scan QR codes.
          </p>
        </div>
      )}

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

      {/* Attendance List */}
      <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Student</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Class</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Check-in Time</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {studentsWithAttendance.map((student) => (
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
                  <td className="px-6 py-4">
                    {student.attendanceStatus ? (
                      <Badge variant={
                        student.attendanceStatus === 'present' ? 'present' :
                        student.attendanceStatus === 'late' ? 'late' : 'absent'
                      }>
                        {student.attendanceStatus}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">Not marked</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {student.checkInTime || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => markAttendance(student.studentId, 'present')}
                        className={`p-2 rounded-lg transition-colors ${
                          student.attendanceStatus === 'present' 
                            ? 'bg-primary/20 text-primary' 
                            : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                        title="Mark Present"
                      >
                        <FiCheckCircle className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => markAttendance(student.studentId, 'late')}
                        className={`p-2 rounded-lg transition-colors ${
                          student.attendanceStatus === 'late' 
                            ? 'bg-secondary/20 text-secondary' 
                            : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                        title="Mark Late"
                      >
                        <FiClock className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => markAttendance(student.studentId, 'absent')}
                        className={`p-2 rounded-lg transition-colors ${
                          student.attendanceStatus === 'absent' 
                            ? 'bg-destructive/20 text-destructive' 
                            : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                        title="Mark Absent"
                      >
                        <FiXCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
