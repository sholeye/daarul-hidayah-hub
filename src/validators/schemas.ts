import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
});

export const studentRegistrationSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  origin: z.string().min(2, 'State of origin is required'),
  sex: z.enum(['male', 'female'], { required_error: 'Please select sex' }),
  class: z.string().min(1, 'Please select a class'),
  guardianName: z.string().min(3, 'Guardian name must be at least 3 characters'),
  guardianPhone: z.string().min(10, 'Guardian phone must be at least 10 digits'),
  guardianOccupation: z.string().min(2, 'Guardian occupation is required'),
  guardianStateOfOrigin: z.string().min(2, 'Guardian state of origin is required'),
});

export const resultSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  score: z.number().min(0, 'Score cannot be negative').max(100, 'Score cannot exceed 100'),
});

export const announcementSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  category: z.enum(['general', 'academic', 'event', 'urgent']),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type StudentRegistrationFormData = z.infer<typeof studentRegistrationSchema>;
export type ResultFormData = z.infer<typeof resultSchema>;
export type AnnouncementFormData = z.infer<typeof announcementSchema>;
