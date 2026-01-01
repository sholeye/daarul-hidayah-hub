/**
 * =============================================================================
 * SUPABASE CLIENT CONFIGURATION
 * =============================================================================
 * 
 * This file initializes the Supabase client for the Daarul Hidayah application.
 * 
 * IMPORTANT: Replace these placeholder values with your actual Supabase credentials.
 * You can find these in your Supabase project settings > API.
 * 
 * The application is designed to work gracefully when Supabase is not configured,
 * falling back to mock data for development and testing purposes.
 * =============================================================================
 */

import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// SUPABASE CREDENTIALS - EDIT THESE WITH YOUR OWN VALUES
// ---------------------------------------------------------------------------
// Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// ---------------------------------------------------------------------------
// Create and export the Supabase client instance
// ---------------------------------------------------------------------------
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Store session in localStorage for persistence
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    // Persist session across browser sessions
    persistSession: true,
    // Auto refresh token before expiry
    autoRefreshToken: true,
  },
});

// ---------------------------------------------------------------------------
// Helper function to check if Supabase is properly configured
// ---------------------------------------------------------------------------
export const isSupabaseConfigured = (): boolean => {
  return (
    !SUPABASE_URL.includes('YOUR_PROJECT_ID') &&
    !SUPABASE_ANON_KEY.includes('YOUR_SUPABASE_ANON_KEY')
  );
};

// ---------------------------------------------------------------------------
// Database table types for TypeScript support
// ---------------------------------------------------------------------------
export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string;
          student_id: string;
          full_name: string;
          email: string;
          date_of_birth: string;
          address: string;
          phone: string;
          origin: string;
          sex: 'male' | 'female';
          guardian_name: string;
          guardian_phone: string;
          guardian_occupation: string;
          guardian_state: string;
          class: string;
          enrollment_date: string;
          fee_status: 'paid' | 'unpaid' | 'partial';
          amount_paid: number;
          total_fee: number;
          image_url?: string;
          qr_code?: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['students']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['students']['Insert']>;
      };
      results: {
        Row: {
          id: string;
          student_id: string;
          term: string;
          session: string;
          subjects: Array<{
            subject: string;
            score: number;
            grade: string;
            remarks: string;
          }>;
          total_score: number;
          average_score: number;
          position: number;
          teacher_remarks: string;
          principal_remarks: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['results']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['results']['Insert']>;
      };
      attendance: {
        Row: {
          id: string;
          student_id: string;
          date: string;
          status: 'present' | 'absent' | 'late';
          check_in_time?: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['attendance']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['attendance']['Insert']>;
      };
      payments: {
        Row: {
          id: string;
          student_id: string;
          amount: number;
          date: string;
          term: string;
          session: string;
          payment_method: string;
          receipt_number: string;
          status: 'completed' | 'pending' | 'failed';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['payments']['Insert']>;
      };
      announcements: {
        Row: {
          id: string;
          title: string;
          content: string;
          category: 'academic' | 'event' | 'urgent' | 'general';
          is_active: boolean;
          created_by: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['announcements']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['announcements']['Insert']>;
      };
    };
  };
}
