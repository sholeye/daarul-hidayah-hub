/**
 * =============================================================================
 * STUDENTS MANAGEMENT PAGE
 * =============================================================================
 * 
 * Complete student management with registration, listing, editing, and QR code.
 * Admin creates students with auto-generated login credentials.
 * =============================================================================
 */

import React, { useState } from 'react';
import { 
  FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye, FiX,
  FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiDownload,
  FiCopy, FiCheck, FiKey
} from 'react-icons/fi';
import { mockStudents, schoolClasses } from '@/data/mockData';
import { Student } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { generateStudentId, formatCurrency, formatDate } from '@/utils/helpers';
import { generateStudentCredentials } from '@/features/auth/AuthContext';
import QRCode from 'qrcode';

// ---------------------------------------------------------------------------
// Student Registration Modal
// ---------------------------------------------------------------------------
interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (student: Partial<Student>, credentials: { username: string; password: string }) => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    dateOfBirth: '',
    address: '',
    phone: '',
    origin: '',
    sex: 'male' as 'male' | 'female',
    guardianName: '',
    guardianPhone: '',
    guardianOccupation: '',
    guardianState: '',
    class: schoolClasses[0].name,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const studentId = generateStudentId(formData.fullName, mockStudents.length + 1);
    const credentials = generateStudentCredentials(formData.fullName, studentId);
    
    onSubmit({
      studentId,
      fullName: formData.fullName,
      email: credentials.username,
      dateOfBirth: formData.dateOfBirth,
      address: formData.address,
      phone: formData.phone,
      origin: formData.origin,
      sex: formData.sex,
      guardian: {
        name: formData.guardianName,
        phone: formData.guardianPhone,
        occupation: formData.guardianOccupation,
        stateOfOrigin: formData.guardianState,
      },
      class: formData.class,
      enrollmentDate: new Date().toISOString().split('T')[0],
      feeStatus: 'unpaid',
      amountPaid: 0,
      totalFee: 6000,
    }, credentials);
    
    // Reset form
    setFormData({
      fullName: '',
      email: '',
      dateOfBirth: '',
      address: '',
      phone: '',
      origin: '',
      sex: 'male',
      guardianName: '',
      guardianPhone: '',
      guardianOccupation: '',
      guardianState: '',
      class: schoolClasses[0].name,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border shadow-strong w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Register New Student</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Student Information */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <FiUser className="w-4 h-4 text-primary" />
              Student Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Muhammad Abdullah"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Date of Birth *</label>
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Sex *</label>
                <select
                  value={formData.sex}
                  onChange={(e) => setFormData({ ...formData, sex: e.target.value as 'male' | 'female' })}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Class *</label>
                <select
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground"
                  required
                >
                  {schoolClasses.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="08012345678"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">State of Origin</label>
                <Input
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  placeholder="Ogun State"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Address *</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main Street, Abeokuta"
                  required
                />
              </div>
            </div>
          </div>

          {/* Guardian Information */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <FiUser className="w-4 h-4 text-secondary" />
              Guardian Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Guardian Name *</label>
                <Input
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                  placeholder="Mr. Abdullah"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Guardian Phone *</label>
                <Input
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                  placeholder="08012345678"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Occupation</label>
                <Input
                  value={formData.guardianOccupation}
                  onChange={(e) => setFormData({ ...formData, guardianOccupation: e.target.value })}
                  placeholder="Teacher"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">State of Origin</label>
                <Input
                  value={formData.guardianState}
                  onChange={(e) => setFormData({ ...formData, guardianState: e.target.value })}
                  placeholder="Ogun State"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              <FiPlus className="w-4 h-4 mr-2" />
              Register Student
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Student Edit Modal
// ---------------------------------------------------------------------------
interface EditModalProps {
  student: Student | null;
  onClose: () => void;
  onSave: (student: Student) => void;
}

const EditModal: React.FC<EditModalProps> = ({ student, onClose, onSave }) => {
  const [formData, setFormData] = useState<Student | null>(student);

  React.useEffect(() => {
    setFormData(student);
  }, [student]);

  if (!student || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border shadow-strong w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Edit Student</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Class</label>
              <select
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground"
              >
                {schoolClasses.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
              <Input
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">State of Origin</label>
              <Input
                value={formData.origin || ''}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Address</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Fee Status</label>
              <select
                value={formData.feeStatus}
                onChange={(e) => setFormData({ ...formData, feeStatus: e.target.value as 'paid' | 'partial' | 'unpaid' })}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground"
              >
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Amount Paid (₦)</label>
              <Input
                type="number"
                value={formData.amountPaid}
                onChange={(e) => setFormData({ ...formData, amountPaid: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Guardian Name</label>
              <Input
                value={formData.guardian.name}
                onChange={(e) => setFormData({ ...formData, guardian: { ...formData.guardian, name: e.target.value } })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Guardian Phone</label>
              <Input
                value={formData.guardian.phone}
                onChange={(e) => setFormData({ ...formData, guardian: { ...formData.guardian, phone: e.target.value } })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              <FiCheck className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Student Detail Modal (View Only)
// ---------------------------------------------------------------------------
interface StudentDetailModalProps {
  student: Student | null;
  onClose: () => void;
}

const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ student, onClose }) => {
  const [qrCode, setQrCode] = useState<string>('');
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (student) {
      QRCode.toDataURL(student.studentId, { width: 200, margin: 2 })
        .then(setQrCode)
        .catch(console.error);
    }
  }, [student]);

  if (!student) return null;

  const credentials = generateStudentCredentials(student.fullName, student.studentId);

  const copyCredentials = () => {
    navigator.clipboard.writeText(`Username: ${credentials.username}\nPassword: ${credentials.password}`);
    setCopied(true);
    toast.success('Credentials copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border shadow-strong w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Student Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Student Info */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-2xl">{student.fullName[0]}</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">{student.fullName}</h3>
              <p className="text-muted-foreground">{student.studentId}</p>
              <Badge variant={student.feeStatus === 'paid' ? 'paid' : student.feeStatus === 'partial' ? 'partial' : 'unpaid'} className="mt-2">
                {student.feeStatus}
              </Badge>
            </div>
          </div>

          {/* Login Credentials */}
          <div className="p-4 bg-muted/50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <FiKey className="w-4 h-4 text-primary" />
                Login Credentials
              </h4>
              <button 
                onClick={copyCredentials}
                className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
              >
                {copied ? <FiCheck className="w-4 h-4 text-primary" /> : <FiCopy className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-sm space-y-1">
              <p><span className="text-muted-foreground">Username:</span> <span className="font-mono text-foreground">{credentials.username}</span></p>
              <p><span className="text-muted-foreground">Password:</span> <span className="font-mono text-foreground">{credentials.password}</span></p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Class</p>
              <p className="font-medium text-foreground">{student.class}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Date of Birth</p>
              <p className="font-medium text-foreground">{formatDate(student.dateOfBirth)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p className="font-medium text-foreground">{student.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Origin</p>
              <p className="font-medium text-foreground">{student.origin || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground">Address</p>
              <p className="font-medium text-foreground">{student.address}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Guardian</p>
              <p className="font-medium text-foreground">{student.guardian.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Guardian Phone</p>
              <p className="font-medium text-foreground">{student.guardian.phone}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Amount Paid</p>
              <p className="font-medium text-foreground">{formatCurrency(student.amountPaid)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Fee</p>
              <p className="font-medium text-foreground">{formatCurrency(student.totalFee)}</p>
            </div>
          </div>

          {/* QR Code */}
          {qrCode && (
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-xl">
              <img src={qrCode} alt="Student QR Code" className="w-32 h-32" />
              <p className="text-sm text-muted-foreground mt-2">Scan for attendance</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => {
                const link = document.createElement('a');
                link.download = `${student.studentId}-qr.png`;
                link.href = qrCode;
                link.click();
              }}>
                <FiDownload className="w-4 h-4 mr-2" />
                Download QR
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Credentials Modal (Shown after registration)
// ---------------------------------------------------------------------------
interface CredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  credentials: { username: string; password: string } | null;
  studentName: string;
}

const CredentialsModal: React.FC<CredentialsModalProps> = ({ isOpen, onClose, credentials, studentName }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !credentials) return null;

  const copyCredentials = () => {
    navigator.clipboard.writeText(`Username: ${credentials.username}\nPassword: ${credentials.password}`);
    setCopied(true);
    toast.success('Credentials copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border shadow-strong w-full max-w-md">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Student Registered!</h2>
          <p className="text-muted-foreground text-sm mt-1">Login credentials for {studentName}</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <FiKey className="w-4 h-4 text-primary" />
                Login Credentials
              </h4>
              <button 
                onClick={copyCredentials}
                className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg flex items-center gap-2"
              >
                {copied ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="space-y-2 font-mono text-sm">
              <p className="flex items-center gap-2">
                <span className="text-muted-foreground w-20">Username:</span>
                <span className="text-foreground break-all">{credentials.username}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-muted-foreground w-20">Password:</span>
                <span className="text-foreground">{credentials.password}</span>
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Please share these credentials with the student. The password is the student ID and should be changed after first login.
          </p>

          <Button onClick={onClose} className="w-full">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Students Page
// ---------------------------------------------------------------------------
export const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [filterClass, setFilterClass] = useState('all');
  const [newCredentials, setNewCredentials] = useState<{ username: string; password: string } | null>(null);
  const [newStudentName, setNewStudentName] = useState('');

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = filterClass === 'all' || s.class === filterClass;
    return matchesSearch && matchesClass;
  });

  // Handle new registration
  const handleRegister = (studentData: Partial<Student>, credentials: { username: string; password: string }) => {
    const newStudent = { ...studentData, id: Date.now().toString() } as Student;
    setStudents([newStudent, ...students]);
    setShowRegistration(false);
    setNewCredentials(credentials);
    setNewStudentName(studentData.fullName || '');
    toast.success(`Student ${newStudent.fullName} registered successfully!`);
  };

  // Handle student edit
  const handleSaveEdit = (updatedStudent: Student) => {
    setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    toast.success('Student updated successfully!');
  };

  // Handle student delete
  const handleDelete = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (confirm(`Are you sure you want to delete ${student?.fullName}? This action cannot be undone.`)) {
      setStudents(students.filter(s => s.id !== studentId));
      toast.success('Student deleted successfully!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground mt-1">Manage student registrations and records</p>
        </div>
        <Button onClick={() => setShowRegistration(true)} className="btn-glow">
          <FiPlus className="w-4 h-4 mr-2" />
          Register Student
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or ID..."
            className="pl-12"
          />
        </div>
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="h-10 px-4 rounded-lg border border-input bg-background text-foreground"
        >
          <option value="all">All Classes</option>
          {schoolClasses.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Students Table */}
      <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Student</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">ID</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Class</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Fee Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-foreground font-bold">{student.fullName[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{student.fullName}</p>
                        <p className="text-sm text-muted-foreground">{student.guardian.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground font-mono">{student.studentId}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{student.class}</td>
                  <td className="px-6 py-4">
                    <Badge variant={student.feeStatus === 'paid' ? 'paid' : student.feeStatus === 'partial' ? 'partial' : 'unpaid'}>
                      {student.feeStatus}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedStudent(student)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                        title="View Details"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setEditingStudent(student)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                        title="Edit Student"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(student.id)}
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive"
                        title="Delete Student"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="p-12 text-center">
            <FiUser className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No students found</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <RegistrationModal
        isOpen={showRegistration}
        onClose={() => setShowRegistration(false)}
        onSubmit={handleRegister}
      />
      <StudentDetailModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
      <EditModal
        student={editingStudent}
        onClose={() => setEditingStudent(null)}
        onSave={handleSaveEdit}
      />
      <CredentialsModal
        isOpen={!!newCredentials}
        onClose={() => { setNewCredentials(null); setNewStudentName(''); }}
        credentials={newCredentials}
        studentName={newStudentName}
      />
    </div>
  );
};
