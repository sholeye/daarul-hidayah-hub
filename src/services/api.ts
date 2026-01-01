/**
 * =============================================================================
 * API SERVICE LAYER
 * =============================================================================
 * 
 * This service layer follows the repository pattern inspired by Jonas 
 * Schmedtmann's Wild Oasis project. It abstracts data fetching operations
 * and provides a clean interface for components to interact with data.
 * 
 * Features:
 * - Automatic fallback to mock data when Supabase is not configured
 * - Type-safe operations with TypeScript
 * - Consistent error handling
 * - Clean separation of concerns
 * =============================================================================
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { 
  mockStudents, 
  mockResults, 
  mockAnnouncements, 
  mockPayments, 
  mockAttendance 
} from '@/data/mockData';
import { Student, StudentResult, Announcement, Payment, AttendanceRecord } from '@/types';

// ---------------------------------------------------------------------------
// STUDENTS API
// ---------------------------------------------------------------------------

/**
 * Fetches all students from the database or returns mock data
 */
export async function getStudents(): Promise<Student[]> {
  // Return mock data if Supabase is not configured
  if (!isSupabaseConfigured()) {
    return mockStudents;
  }

  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching students:', error);
    return mockStudents; // Fallback to mock data on error
  }

  return data || mockStudents;
}

/**
 * Fetches a single student by ID
 */
export async function getStudentById(studentId: string): Promise<Student | null> {
  if (!isSupabaseConfigured()) {
    return mockStudents.find(s => s.studentId === studentId) || null;
  }

  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('student_id', studentId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching student:', error);
    return mockStudents.find(s => s.studentId === studentId) || null;
  }

  return data;
}

/**
 * Creates a new student record
 */
export async function createStudent(student: Omit<Student, 'id'>): Promise<Student | null> {
  if (!isSupabaseConfigured()) {
    // For mock mode, add to local state
    const newStudent = { ...student, id: Date.now().toString() } as Student;
    mockStudents.push(newStudent);
    return newStudent;
  }

  const { data, error } = await supabase
    .from('students')
    .insert([{
      student_id: student.studentId,
      full_name: student.fullName,
      email: student.email,
      date_of_birth: student.dateOfBirth,
      address: student.address,
      phone: student.phone,
      origin: student.origin,
      sex: student.sex,
      guardian_name: student.guardian.name,
      guardian_phone: student.guardian.phone,
      guardian_occupation: student.guardian.occupation,
      guardian_state: student.guardian.stateOfOrigin,
      class: student.class,
      enrollment_date: student.enrollmentDate,
      fee_status: student.feeStatus,
      amount_paid: student.amountPaid,
      total_fee: student.totalFee,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating student:', error);
    return null;
  }

  return data;
}

/**
 * Updates an existing student record
 */
export async function updateStudent(id: string, updates: Partial<Student>): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const index = mockStudents.findIndex(s => s.id === id);
    if (index !== -1) {
      mockStudents[index] = { ...mockStudents[index], ...updates };
      return true;
    }
    return false;
  }

  const { error } = await supabase
    .from('students')
    .update(updates)
    .eq('id', id);

  return !error;
}

// ---------------------------------------------------------------------------
// RESULTS API
// ---------------------------------------------------------------------------

/**
 * Fetches all results or results for a specific student
 */
export async function getResults(studentId?: string): Promise<StudentResult[]> {
  if (!isSupabaseConfigured()) {
    return studentId 
      ? mockResults.filter(r => r.studentId === studentId)
      : mockResults;
  }

  let query = supabase.from('results').select('*');
  
  if (studentId) {
    query = query.eq('student_id', studentId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching results:', error);
    return studentId 
      ? mockResults.filter(r => r.studentId === studentId)
      : mockResults;
  }

  return data || mockResults;
}

/**
 * Creates a new result record
 */
export async function createResult(result: Omit<StudentResult, 'id'>): Promise<StudentResult | null> {
  if (!isSupabaseConfigured()) {
    const newResult = { ...result, id: Date.now().toString() } as StudentResult;
    mockResults.push(newResult);
    return newResult;
  }

  const { data, error } = await supabase
    .from('results')
    .insert([{
      student_id: result.studentId,
      term: result.term,
      session: result.session,
      subjects: result.subjects,
      total_score: result.totalScore,
      average_score: result.averageScore,
      position: result.position,
      teacher_remarks: result.teacherRemarks,
      principal_remarks: result.principalRemarks,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating result:', error);
    return null;
  }

  return data;
}

// ---------------------------------------------------------------------------
// ATTENDANCE API
// ---------------------------------------------------------------------------

/**
 * Fetches attendance records
 */
export async function getAttendance(studentId?: string, date?: string): Promise<AttendanceRecord[]> {
  if (!isSupabaseConfigured()) {
    let records = mockAttendance;
    if (studentId) records = records.filter(a => a.studentId === studentId);
    if (date) records = records.filter(a => a.date === date);
    return records;
  }

  let query = supabase.from('attendance').select('*');
  
  if (studentId) query = query.eq('student_id', studentId);
  if (date) query = query.eq('date', date);

  const { data, error } = await query.order('date', { ascending: false });

  if (error) {
    console.error('Error fetching attendance:', error);
    return mockAttendance;
  }

  return data || mockAttendance;
}

/**
 * Records attendance for a student
 */
export async function recordAttendance(
  studentId: string, 
  status: 'present' | 'absent' | 'late',
  checkInTime?: string
): Promise<AttendanceRecord | null> {
  const today = new Date().toISOString().split('T')[0];
  
  if (!isSupabaseConfigured()) {
    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      studentId,
      date: today,
      status,
      checkInTime,
    };
    mockAttendance.push(newRecord);
    return newRecord;
  }

  const { data, error } = await supabase
    .from('attendance')
    .insert([{
      student_id: studentId,
      date: today,
      status,
      check_in_time: checkInTime,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error recording attendance:', error);
    return null;
  }

  return data;
}

// ---------------------------------------------------------------------------
// PAYMENTS API
// ---------------------------------------------------------------------------

/**
 * Fetches all payments
 */
export async function getPayments(studentId?: string): Promise<Payment[]> {
  if (!isSupabaseConfigured()) {
    return studentId 
      ? mockPayments.filter(p => p.studentId === studentId)
      : mockPayments;
  }

  let query = supabase.from('payments').select('*');
  
  if (studentId) query = query.eq('student_id', studentId);

  const { data, error } = await query.order('date', { ascending: false });

  if (error) {
    console.error('Error fetching payments:', error);
    return mockPayments;
  }

  return data || mockPayments;
}

/**
 * Records a new payment
 */
export async function recordPayment(payment: Omit<Payment, 'id'>): Promise<Payment | null> {
  if (!isSupabaseConfigured()) {
    const newPayment = { ...payment, id: Date.now().toString() } as Payment;
    mockPayments.push(newPayment);
    return newPayment;
  }

  const { data, error } = await supabase
    .from('payments')
    .insert([{
      student_id: payment.studentId,
      amount: payment.amount,
      date: payment.date,
      term: payment.term,
      session: payment.session,
      payment_method: payment.paymentMethod,
      receipt_number: payment.receiptNumber,
      status: payment.status,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error recording payment:', error);
    return null;
  }

  return data;
}

// ---------------------------------------------------------------------------
// ANNOUNCEMENTS API
// ---------------------------------------------------------------------------

/**
 * Fetches all active announcements
 */
export async function getAnnouncements(): Promise<Announcement[]> {
  if (!isSupabaseConfigured()) {
    return mockAnnouncements;
  }

  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching announcements:', error);
    return mockAnnouncements;
  }

  return data || mockAnnouncements;
}

/**
 * Creates a new announcement
 */
export async function createAnnouncement(
  announcement: Omit<Announcement, 'id' | 'createdAt'>
): Promise<Announcement | null> {
  if (!isSupabaseConfigured()) {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    mockAnnouncements.unshift(newAnnouncement);
    return newAnnouncement;
  }

  const { data, error } = await supabase
    .from('announcements')
    .insert([{
      title: announcement.title,
      content: announcement.content,
      category: announcement.category,
      is_active: announcement.isActive,
      created_by: announcement.createdBy,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating announcement:', error);
    return null;
  }

  return data;
}
