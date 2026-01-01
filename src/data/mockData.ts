import { Student, StudentResult, Announcement, SchoolEvent, Payment, SchoolClass, AttendanceRecord, User, Notification } from '@/types';

// School Classes
export const schoolClasses: SchoolClass[] = [
  { id: '1', name: 'Safu Awwal', nameArabic: 'الصف الأول', level: 'preparatory', studentCount: 25 },
  { id: '2', name: 'Safu Thaniy', nameArabic: 'الصف الثاني', level: 'preparatory', studentCount: 22 },
  { id: '3', name: 'Safu Thalith', nameArabic: 'الصف الثالث', level: 'preparatory', studentCount: 20 },
  { id: '4', name: 'Awwal Ibtida\'i', nameArabic: 'الأول ابتدائي', level: 'primary', studentCount: 28 },
  { id: '5', name: 'Thaniy Ibtida\'i', nameArabic: 'الثاني ابتدائي', level: 'primary', studentCount: 24 },
  { id: '6', name: 'Thalith Ibtida\'i', nameArabic: 'الثالث ابتدائي', level: 'primary', studentCount: 18 },
];

// Mock Students
export const mockStudents: Student[] = [
  {
    id: '1',
    studentId: 'Kathir_001',
    fullName: 'Muhammad AbdulKathir Olohunsola',
    email: 'kathir001@daarulhidayah.edu',
    dateOfBirth: '2015-03-15',
    address: 'Ita Ika, Abeokuta, Ogun State',
    phone: '08012345678',
    origin: 'Ogun State',
    sex: 'male',
    guardian: {
      name: 'AbdulHameed Olohunsola',
      phone: '08085944916',
      occupation: 'IT Professional',
      stateOfOrigin: 'Ogun State',
    },
    class: 'Awwal Ibtida\'i',
    enrollmentDate: '2023-01-15',
    feeStatus: 'paid',
    amountPaid: 6000,
    totalFee: 6000,
  },
  {
    id: '2',
    studentId: 'Aisha_002',
    fullName: 'Aisha Fatimah Ibrahim',
    email: 'aisha002@daarulhidayah.edu',
    dateOfBirth: '2016-07-22',
    address: 'Kuto, Abeokuta, Ogun State',
    phone: '08023456789',
    origin: 'Lagos State',
    sex: 'female',
    guardian: {
      name: 'Ibrahim Adewale',
      phone: '08034567890',
      occupation: 'Teacher',
      stateOfOrigin: 'Lagos State',
    },
    class: 'Safu Thaniy',
    enrollmentDate: '2023-02-01',
    feeStatus: 'unpaid',
    amountPaid: 0,
    totalFee: 6000,
  },
  {
    id: '3',
    studentId: 'Umar_003',
    fullName: 'Umar Abdullahi Bello',
    email: 'umar003@daarulhidayah.edu',
    dateOfBirth: '2014-11-10',
    address: 'Lafenwa, Abeokuta, Ogun State',
    phone: '08045678901',
    origin: 'Kwara State',
    sex: 'male',
    guardian: {
      name: 'Abdullahi Bello',
      phone: '08056789012',
      occupation: 'Trader',
      stateOfOrigin: 'Kwara State',
    },
    class: 'Thaniy Ibtida\'i',
    enrollmentDate: '2022-09-01',
    feeStatus: 'partial',
    amountPaid: 3000,
    totalFee: 6000,
  },
];

// Mock Results
export const mockResults: StudentResult[] = [
  {
    id: '1',
    studentId: 'Kathir_001',
    term: 'First Term',
    session: '2024/2025',
    subjects: [
      { subject: 'Arabic Language', score: 85, grade: 'A', remarks: 'Excellent' },
      { subject: 'Islamic Studies', score: 90, grade: 'A', remarks: 'Outstanding' },
      { subject: 'Quran Memorization', score: 88, grade: 'A', remarks: 'Very Good' },
      { subject: 'Hadith', score: 82, grade: 'B', remarks: 'Good' },
      { subject: 'Fiqh', score: 78, grade: 'B', remarks: 'Good' },
      { subject: 'English Language', score: 75, grade: 'B', remarks: 'Good' },
      { subject: 'Mathematics', score: 80, grade: 'A', remarks: 'Very Good' },
      { subject: 'IT/Computer', score: 92, grade: 'A', remarks: 'Outstanding' },
    ],
    totalScore: 670,
    averageScore: 83.75,
    position: 1,
    teacherRemarks: 'An excellent student with remarkable dedication to Islamic studies.',
    principalRemarks: 'Keep up the good work. May Allah bless your efforts.',
    createdAt: '2024-12-15',
  },
];

// Mock Announcements
export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'IT Program Enrollment Open',
    content: 'We are pleased to announce that our 2-week IT program covering HTML and CSS fundamentals is now accepting enrollments. This program is designed to introduce students to web development basics.',
    category: 'academic',
    createdAt: '2024-12-20',
    createdBy: 'Admin',
    isActive: true,
  },
  {
    id: '2',
    title: 'Muhadoro End-of-Term Program',
    content: 'The annual Muhadoro (end-of-term program) and prize giving ceremony will be held at the end of this term. Parents and guardians are cordially invited to attend.',
    category: 'event',
    createdAt: '2024-12-18',
    createdBy: 'Admin',
    isActive: true,
  },
  {
    id: '3',
    title: 'Fee Payment Reminder',
    content: 'Parents are reminded to complete fee payments for the current term. The school fee is ₦6,000 per term. Please ensure timely payment to avoid disruption in your ward\'s academic activities.',
    category: 'urgent',
    createdAt: '2024-12-15',
    createdBy: 'Admin',
    isActive: true,
  },
];

// Mock Events
export const mockEvents: SchoolEvent[] = [
  {
    id: '1',
    title: '2-Week IT Program (HTML & CSS)',
    description: 'Intensive introduction to web development covering HTML structure, CSS styling, and basic web design principles.',
    date: '2024-12-20',
    type: 'ongoing',
    location: 'Computer Lab',
  },
  {
    id: '2',
    title: 'Muhadoro End-of-Term Ceremony',
    description: 'Annual end-of-term program featuring Quran recitation, Islamic lectures, and prize giving for outstanding students.',
    date: '2025-01-15',
    type: 'upcoming',
    location: 'School Hall',
  },
  {
    id: '3',
    title: 'Tahfiz Program Launch',
    description: 'Official launch of the new Tahfiz (Quran Memorization) program for dedicated students.',
    date: '2025-01-20',
    type: 'upcoming',
    location: 'Main Mosque',
  },
];

// Mock Payments
export const mockPayments: Payment[] = [
  {
    id: '1',
    studentId: 'Kathir_001',
    amount: 6000,
    date: '2024-09-05',
    term: 'First Term',
    session: '2024/2025',
    paymentMethod: 'Bank Transfer',
    receiptNumber: 'RCP-2024-001',
    status: 'completed',
  },
];

// Mock Attendance
export const mockAttendance: AttendanceRecord[] = [
  { id: '1', studentId: 'Kathir_001', date: '2024-12-20', status: 'present', checkInTime: '07:45' },
  { id: '2', studentId: 'Kathir_001', date: '2024-12-19', status: 'present', checkInTime: '07:50' },
  { id: '3', studentId: 'Kathir_001', date: '2024-12-18', status: 'late', checkInTime: '08:15' },
  { id: '4', studentId: 'Aisha_002', date: '2024-12-20', status: 'present', checkInTime: '07:30' },
  { id: '5', studentId: 'Umar_003', date: '2024-12-20', status: 'absent' },
];

// Mock Users
export const mockUsers: User[] = [
  { id: '1', email: 'admin@daarulhidayah.edu', name: 'Abu Kathir AbdulHameed', role: 'admin' },
  { id: '2', email: 'teacher@daarulhidayah.edu', name: 'Ustadh Ibrahim', role: 'instructor' },
  { id: '3', email: 'student@daarulhidayah.edu', name: 'Muhammad Kathir', role: 'learner' },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  { id: '1', title: 'New Student Registered', message: 'A new student has been registered.', type: 'info', isRead: false, createdAt: '2024-12-20T10:00:00Z', userId: '1' },
  { id: '2', title: 'Payment Received', message: 'Payment of ₦6,000 received from Kathir_001.', type: 'success', isRead: false, createdAt: '2024-12-19T14:30:00Z', userId: '1' },
];
