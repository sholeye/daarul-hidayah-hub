/**
 * SharedDataContext - Centralized data store for blog posts, announcements, students, etc.
 * Ensures data is shared across admin and public pages.
 * Persists to localStorage so changes survive navigation.
 */

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { BlogPost, Announcement, Student, Payment, AttendanceRecord, StudentResult } from '@/types';
import { mockBlogPosts } from '@/data/blogMockData';
import { mockStudents, mockAnnouncements, mockPayments, mockAttendance, mockResults } from '@/data/mockData';

interface SharedDataContextType {
  // Blog
  blogPosts: BlogPost[];
  addBlogPost: (post: BlogPost) => void;
  updateBlogPost: (id: string, data: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  toggleBlogLike: (postId: string, userId: string) => void;

  // Announcements
  announcements: Announcement[];
  addAnnouncement: (ann: Announcement) => void;
  updateAnnouncement: (id: string, data: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
  toggleAnnouncementActive: (id: string) => void;

  // Students
  students: Student[];
  addStudent: (student: Student) => void;
  updateStudent: (id: string, data: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  // Payments
  payments: Payment[];
  addPayment: (payment: Payment) => void;

  // Attendance
  attendance: AttendanceRecord[];
  setAttendanceRecord: (record: AttendanceRecord) => void;
  bulkSetAttendance: (records: AttendanceRecord[]) => void;

  // Results
  results: StudentResult[];
  addOrUpdateResult: (result: StudentResult) => void;
}

const SharedDataContext = createContext<SharedDataContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(`dh_${key}`);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(`dh_${key}`, JSON.stringify(data));
  } catch { /* storage full, silently fail */ }
}

export const SharedDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => loadFromStorage('blogPosts', mockBlogPosts));
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => loadFromStorage('announcements', mockAnnouncements));
  const [students, setStudents] = useState<Student[]>(() => loadFromStorage('students', mockStudents));
  const [payments, setPayments] = useState<Payment[]>(() => loadFromStorage('payments', mockPayments));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => loadFromStorage('attendance', mockAttendance));
  const [results, setResults] = useState<StudentResult[]>(() => loadFromStorage('results', mockResults));

  // Persist on change
  useEffect(() => { saveToStorage('blogPosts', blogPosts); }, [blogPosts]);
  useEffect(() => { saveToStorage('announcements', announcements); }, [announcements]);
  useEffect(() => { saveToStorage('students', students); }, [students]);
  useEffect(() => { saveToStorage('payments', payments); }, [payments]);
  useEffect(() => { saveToStorage('attendance', attendance); }, [attendance]);
  useEffect(() => { saveToStorage('results', results); }, [results]);

  // Blog
  const addBlogPost = useCallback((post: BlogPost) => setBlogPosts(prev => [post, ...prev]), []);
  const updateBlogPost = useCallback((id: string, data: Partial<BlogPost>) => 
    setBlogPosts(prev => prev.map(p => p.id === id ? { ...p, ...data } as BlogPost : p)), []);
  const deleteBlogPost = useCallback((id: string) => setBlogPosts(prev => prev.filter(p => p.id !== id)), []);
  const toggleBlogLike = useCallback((postId: string, userId: string) => {
    setBlogPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const hasLiked = p.likes.includes(userId);
      return { ...p, likes: hasLiked ? p.likes.filter(id => id !== userId) : [...p.likes, userId] };
    }));
  }, []);

  // Announcements
  const addAnnouncement = useCallback((ann: Announcement) => setAnnouncements(prev => [ann, ...prev]), []);
  const updateAnnouncement = useCallback((id: string, data: Partial<Announcement>) =>
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...data } as Announcement : a)), []);
  const deleteAnnouncement = useCallback((id: string) => setAnnouncements(prev => prev.filter(a => a.id !== id)), []);
  const toggleAnnouncementActive = useCallback((id: string) =>
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a)), []);

  // Students
  const addStudent = useCallback((student: Student) => setStudents(prev => [student, ...prev]), []);
  const updateStudent = useCallback((id: string, data: Partial<Student>) =>
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...data } as Student : s)), []);
  const deleteStudent = useCallback((id: string) => setStudents(prev => prev.filter(s => s.id !== id)), []);

  // Payments
  const addPayment = useCallback((payment: Payment) => {
    setPayments(prev => [payment, ...prev]);
    // Update student fee status
    setStudents(prev => prev.map(s => {
      if (s.studentId !== payment.studentId) return s;
      const newAmountPaid = s.amountPaid + payment.amount;
      const newStatus = newAmountPaid >= s.totalFee ? 'paid' : newAmountPaid > 0 ? 'partial' : 'unpaid';
      return { ...s, amountPaid: newAmountPaid, feeStatus: newStatus };
    }));
  }, []);

  // Attendance
  const setAttendanceRecord = useCallback((record: AttendanceRecord) => {
    setAttendance(prev => {
      const idx = prev.findIndex(a => a.studentId === record.studentId && a.date === record.date);
      if (idx >= 0) return prev.map((a, i) => i === idx ? record : a);
      return [...prev, record];
    });
  }, []);
  const bulkSetAttendance = useCallback((records: AttendanceRecord[]) => {
    setAttendance(prev => [...prev, ...records]);
  }, []);

  // Results
  const addOrUpdateResult = useCallback((result: StudentResult) => {
    setResults(prev => {
      const idx = prev.findIndex(r => r.studentId === result.studentId);
      if (idx >= 0) return prev.map((r, i) => i === idx ? result : r);
      return [...prev, result];
    });
  }, []);

  return (
    <SharedDataContext.Provider value={{
      blogPosts, addBlogPost, updateBlogPost, deleteBlogPost, toggleBlogLike,
      announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement, toggleAnnouncementActive,
      students, addStudent, updateStudent, deleteStudent,
      payments, addPayment,
      attendance, setAttendanceRecord, bulkSetAttendance,
      results, addOrUpdateResult,
    }}>
      {children}
    </SharedDataContext.Provider>
  );
};

export const useSharedData = (): SharedDataContextType => {
  const context = useContext(SharedDataContext);
  if (!context) throw new Error('useSharedData must be used within SharedDataProvider');
  return context;
};
