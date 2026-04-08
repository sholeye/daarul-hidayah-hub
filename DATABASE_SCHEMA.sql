-- =============================================================================
-- DAARUL HIDAYAH - COMPLETE DATABASE SCHEMA (Fresh Install)
-- =============================================================================
-- Run this ONCE in your Supabase SQL Editor.
-- IMPORTANT: In Supabase Dashboard > Auth > Settings:
--   1. Set "Confirm email" to OFF
--   2. Set Site URL to your deployed app URL
-- =============================================================================

-- 1. ENUM TYPES
DO $$ BEGIN CREATE TYPE public.app_role AS ENUM ('admin', 'instructor', 'learner', 'parent'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.fee_status AS ENUM ('paid', 'unpaid', 'partial'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.attendance_status AS ENUM ('present', 'absent', 'late', 'excused'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.announcement_category AS ENUM ('general', 'academic', 'event', 'urgent'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.payment_status AS ENUM ('completed', 'pending', 'failed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. USER ROLES TABLE
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- 4. SCHOOL CLASSES
CREATE TABLE IF NOT EXISTS public.school_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  name_arabic TEXT NOT NULL DEFAULT '',
  level TEXT NOT NULL DEFAULT 'primary' CHECK (level IN ('preparatory', 'primary')),
  instructor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  student_id TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  date_of_birth DATE,
  address TEXT,
  phone TEXT,
  origin TEXT,
  sex TEXT CHECK (sex IN ('male', 'female')),
  guardian_name TEXT NOT NULL DEFAULT '',
  guardian_phone TEXT NOT NULL DEFAULT '',
  guardian_occupation TEXT,
  guardian_state TEXT,
  class TEXT NOT NULL,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  fee_status fee_status DEFAULT 'unpaid',
  amount_paid NUMERIC(10,2) DEFAULT 0,
  total_fee NUMERIC(10,2) DEFAULT 6000,
  image_url TEXT,
  qr_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. RESULTS TABLE
CREATE TABLE IF NOT EXISTS public.results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL REFERENCES public.students(student_id) ON DELETE CASCADE,
  term TEXT NOT NULL,
  session TEXT NOT NULL,
  subjects JSONB NOT NULL DEFAULT '[]',
  total_score NUMERIC(10,2) DEFAULT 0,
  average_score NUMERIC(10,2) DEFAULT 0,
  position INTEGER,
  teacher_remarks TEXT,
  principal_remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(student_id, term, session)
);

-- 7. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL REFERENCES public.students(student_id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status attendance_status NOT NULL,
  check_in_time TEXT,
  check_out_time TEXT,
  marked_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(student_id, date)
);

-- 8. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL REFERENCES public.students(student_id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  term TEXT NOT NULL,
  session TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  receipt_number TEXT NOT NULL UNIQUE,
  status payment_status DEFAULT 'completed',
  recorded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category announcement_category DEFAULT 'general',
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL DEFAULT 'Admin',
  author_role app_role DEFAULT 'admin',
  is_published BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  cover_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 11. BLOG LIKES TABLE
CREATE TABLE IF NOT EXISTS public.blog_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(post_id, user_id)
);

-- 12. PASSWORD RESET REQUESTS
CREATE TABLE IF NOT EXISTS public.password_reset_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL REFERENCES public.students(student_id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rejected')),
  requested_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id)
);

-- 13. PARENT-STUDENT LINK TABLE
CREATE TABLE IF NOT EXISTS public.parent_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES public.students(student_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(parent_id, student_id)
);

-- 14. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =============================================================================
-- 15. QUIZ SYSTEM TABLES
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.quiz_houses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  name_arabic TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '',
  total_score INTEGER DEFAULT 0,
  competitions_won INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  question_arabic TEXT,
  type TEXT NOT NULL CHECK (type IN ('mcq', 'true_false', 'short_answer', 'essay')),
  options JSONB DEFAULT '[]',
  correct_answer TEXT NOT NULL DEFAULT '',
  points INTEGER DEFAULT 10,
  time_limit INTEGER DEFAULT 30,
  max_points INTEGER,
  rubric TEXT,
  rubric_arabic TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.quiz_competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TEXT NOT NULL DEFAULT '10:00',
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed', 'grading')),
  question_ids UUID[] DEFAULT '{}',
  reps_per_house INTEGER DEFAULT 3,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.quiz_representatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID NOT NULL REFERENCES public.quiz_competitions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  house TEXT NOT NULL,
  login_code TEXT NOT NULL,
  has_completed BOOLEAN DEFAULT FALSE,
  score INTEGER DEFAULT 0,
  assigned_question_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(competition_id, login_code)
);

CREATE TABLE IF NOT EXISTS public.quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID NOT NULL REFERENCES public.quiz_competitions(id) ON DELETE CASCADE,
  representative_id UUID NOT NULL REFERENCES public.quiz_representatives(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  answer TEXT NOT NULL DEFAULT '',
  is_correct BOOLEAN DEFAULT FALSE,
  points_earned INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0,
  pending_grade BOOLEAN DEFAULT FALSE,
  graded_by UUID REFERENCES auth.users(id),
  graded_at TIMESTAMPTZ,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.quiz_competition_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID NOT NULL REFERENCES public.quiz_competitions(id) ON DELETE CASCADE,
  house_scores JSONB NOT NULL DEFAULT '{}',
  winning_house TEXT NOT NULL,
  top_student_name TEXT,
  top_student_house TEXT,
  top_student_score INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =============================================================================
-- SECURITY DEFINER FUNCTIONS (prevents recursive RLS)
-- =============================================================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Auto-create profile + role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;

  IF NEW.raw_user_meta_data->>'role' IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, (NEW.raw_user_meta_data->>'role')::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_students_updated_at ON public.students;
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
DROP TRIGGER IF EXISTS update_results_updated_at ON public.results;
CREATE TRIGGER update_results_updated_at BEFORE UPDATE ON public.results FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
DROP TRIGGER IF EXISTS update_announcements_updated_at ON public.announcements;
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Notify admins on password reset request
CREATE OR REPLACE FUNCTION public.notify_admins_on_password_reset_request()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type, link)
  SELECT ur.user_id,
         'Password Reset Request 🔑',
         'Student ' || NEW.student_id || ' requested a password reset.',
         'warning',
         '/admin/students'
  FROM public.user_roles ur WHERE ur.role = 'admin';
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS password_reset_requests_notify_admins ON public.password_reset_requests;
CREATE TRIGGER password_reset_requests_notify_admins
  AFTER INSERT ON public.password_reset_requests
  FOR EACH ROW EXECUTE FUNCTION public.notify_admins_on_password_reset_request();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_representatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_competition_results ENABLE ROW LEVEL SECURITY;

-- ===================== DROP ALL EXISTING POLICIES =====================
-- This ensures a clean slate when re-running the script

DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT policyname, tablename, schemaname 
    FROM pg_policies 
    WHERE schemaname = 'public'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

-- PROFILES
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "profiles_select_admin" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_insert_system" ON public.profiles FOR INSERT WITH CHECK (TRUE);

-- USER ROLES
CREATE POLICY "roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "roles_select_admin" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "roles_insert_system" ON public.user_roles FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "roles_update_admin" ON public.user_roles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "roles_delete_admin" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- STUDENTS
CREATE POLICY "students_all_admin" ON public.students FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "students_select_instructor" ON public.students FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.school_classes sc WHERE sc.name = students.class AND sc.instructor_id = auth.uid()));
CREATE POLICY "students_select_own" ON public.students FOR SELECT TO authenticated USING (auth_user_id = auth.uid());
CREATE POLICY "students_select_parent" ON public.students FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.parent_students ps WHERE ps.parent_id = auth.uid() AND ps.student_id = students.student_id));

-- RESULTS
CREATE POLICY "results_all_admin" ON public.results FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "results_all_instructor" ON public.results FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.students s JOIN public.school_classes sc ON sc.name = s.class WHERE s.student_id = results.student_id AND sc.instructor_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.students s JOIN public.school_classes sc ON sc.name = s.class WHERE s.student_id = results.student_id AND sc.instructor_id = auth.uid()));
CREATE POLICY "results_select_own" ON public.results FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.students s WHERE s.student_id = results.student_id AND s.auth_user_id = auth.uid()));
CREATE POLICY "results_select_parent" ON public.results FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.parent_students ps WHERE ps.parent_id = auth.uid() AND ps.student_id = results.student_id));

-- ATTENDANCE
CREATE POLICY "attendance_all_admin" ON public.attendance FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "attendance_all_instructor" ON public.attendance FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.students s JOIN public.school_classes sc ON sc.name = s.class WHERE s.student_id = attendance.student_id AND sc.instructor_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.students s JOIN public.school_classes sc ON sc.name = s.class WHERE s.student_id = attendance.student_id AND sc.instructor_id = auth.uid()));
CREATE POLICY "attendance_select_own" ON public.attendance FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.students s WHERE s.student_id = attendance.student_id AND s.auth_user_id = auth.uid()));
CREATE POLICY "attendance_select_parent" ON public.attendance FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.parent_students ps WHERE ps.parent_id = auth.uid() AND ps.student_id = attendance.student_id));

-- PAYMENTS
CREATE POLICY "payments_all_admin" ON public.payments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "payments_select_own" ON public.payments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.students s WHERE s.student_id = payments.student_id AND s.auth_user_id = auth.uid()));
CREATE POLICY "payments_select_parent" ON public.payments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.parent_students ps WHERE ps.parent_id = auth.uid() AND ps.student_id = payments.student_id));

-- ANNOUNCEMENTS
CREATE POLICY "announcements_select_public" ON public.announcements FOR SELECT USING (is_active = TRUE);
CREATE POLICY "announcements_all_admin" ON public.announcements FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- BLOG POSTS
CREATE POLICY "blog_select_published" ON public.blog_posts FOR SELECT USING (is_published = TRUE);
CREATE POLICY "blog_all_admin" ON public.blog_posts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- BLOG LIKES
CREATE POLICY "likes_select_all" ON public.blog_likes FOR SELECT USING (TRUE);
CREATE POLICY "likes_insert_auth" ON public.blog_likes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "likes_delete_own" ON public.blog_likes FOR DELETE TO authenticated USING (user_id = auth.uid());

-- SCHOOL CLASSES
CREATE POLICY "classes_select_auth" ON public.school_classes FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "classes_all_admin" ON public.school_classes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- PASSWORD RESET REQUESTS
CREATE POLICY "reset_insert_auth" ON public.password_reset_requests FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "reset_select_own" ON public.password_reset_requests FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.students s WHERE s.student_id = password_reset_requests.student_id AND s.auth_user_id = auth.uid()));
CREATE POLICY "reset_all_admin" ON public.password_reset_requests FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- PARENT STUDENTS
CREATE POLICY "parent_students_all_admin" ON public.parent_students FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "parent_students_select_own" ON public.parent_students FOR SELECT TO authenticated USING (parent_id = auth.uid());

-- NOTIFICATIONS
CREATE POLICY "notif_select_own" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notif_update_own" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "notif_delete_own" ON public.notifications FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notif_insert_auth" ON public.notifications FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "notif_insert_system" ON public.notifications FOR INSERT WITH CHECK (TRUE);

-- QUIZ HOUSES (public read, admin write)
CREATE POLICY "quiz_houses_select" ON public.quiz_houses FOR SELECT USING (TRUE);
CREATE POLICY "quiz_houses_all_admin" ON public.quiz_houses FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- QUIZ QUESTIONS
CREATE POLICY "quiz_questions_select" ON public.quiz_questions FOR SELECT USING (TRUE);
CREATE POLICY "quiz_questions_all_admin" ON public.quiz_questions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- QUIZ COMPETITIONS
CREATE POLICY "quiz_competitions_select" ON public.quiz_competitions FOR SELECT USING (TRUE);
CREATE POLICY "quiz_competitions_all_admin" ON public.quiz_competitions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- QUIZ REPRESENTATIVES
CREATE POLICY "quiz_reps_select" ON public.quiz_representatives FOR SELECT USING (TRUE);
CREATE POLICY "quiz_reps_all_admin" ON public.quiz_representatives FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "quiz_reps_update_anon" ON public.quiz_representatives FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

-- QUIZ ANSWERS
CREATE POLICY "quiz_answers_select" ON public.quiz_answers FOR SELECT USING (TRUE);
CREATE POLICY "quiz_answers_insert" ON public.quiz_answers FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "quiz_answers_all_admin" ON public.quiz_answers FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- QUIZ COMPETITION RESULTS
CREATE POLICY "quiz_results_select" ON public.quiz_competition_results FOR SELECT USING (TRUE);
CREATE POLICY "quiz_results_all_admin" ON public.quiz_competition_results FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "quiz_results_insert" ON public.quiz_competition_results FOR INSERT WITH CHECK (TRUE);

-- =============================================================================
-- STORAGE - Avatar bucket
-- =============================================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies to avoid conflicts
DO $$ 
DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname LIKE '%avatar%') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', r.policyname);
  END LOOP;
END $$;

CREATE POLICY "avatar_upload" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "avatar_update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "avatar_delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "avatar_view" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

-- =============================================================================
-- REALTIME - Enable for key tables
-- =============================================================================

DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.students; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.payments; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.results; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.blog_posts; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.blog_likes; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.quiz_houses; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.quiz_competitions; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.quiz_representatives; EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =============================================================================
-- SEED DATA - School Classes
-- =============================================================================

INSERT INTO public.school_classes (name, name_arabic, level) VALUES
  ('Safu Awwal', 'الصف الأول', 'preparatory'),
  ('Safu Thaniy', 'الصف الثاني', 'preparatory'),
  ('Safu Thalith', 'الصف الثالث', 'preparatory'),
  ('Awwal Ibtidai', 'الأول ابتدائي', 'primary'),
  ('Thaniy Ibtidai', 'الثاني ابتدائي', 'primary'),
  ('Thalith Ibtidai', 'الثالث ابتدائي', 'primary')
ON CONFLICT (name) DO NOTHING;

-- SEED DATA - Quiz Houses
INSERT INTO public.quiz_houses (name, name_arabic, color) VALUES
  ('AbuBakr', 'أبو بكر', 'bg-emerald-500'),
  ('Umar', 'عمر', 'bg-blue-500'),
  ('Uthman', 'عثمان', 'bg-amber-500'),
  ('Ali', 'علي', 'bg-rose-500')
ON CONFLICT (name) DO NOTHING;

-- =============================================================================
-- PERFORMANCE INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_students_student_id ON public.students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_class ON public.students(class);
CREATE INDEX IF NOT EXISTS idx_students_auth_user ON public.students(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON public.attendance(student_id, date);
CREATE INDEX IF NOT EXISTS idx_results_student ON public.results(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_student ON public.payments(student_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_post ON public.blog_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_parent_students_parent ON public.parent_students(parent_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_quiz_reps_competition ON public.quiz_representatives(competition_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_competition ON public.quiz_answers(competition_id);
