-- =============================================================================
-- DAARUL HIDAYAH - COMPLETE DATABASE SCHEMA (Fresh Install)
-- =============================================================================
-- Run this ONCE in your Supabase SQL Editor.
-- IMPORTANT: In Supabase Dashboard > Auth > Settings:
--   1. Set "Confirm email" to OFF
--   2. Set Site URL to your deployed app URL
-- =============================================================================

-- 1. ENUM TYPES
CREATE TYPE public.app_role AS ENUM ('admin', 'instructor', 'learner', 'parent');
CREATE TYPE public.fee_status AS ENUM ('paid', 'unpaid', 'partial');
CREATE TYPE public.attendance_status AS ENUM ('present', 'absent', 'late', 'excused');
CREATE TYPE public.announcement_category AS ENUM ('general', 'academic', 'event', 'urgent');
CREATE TYPE public.payment_status AS ENUM ('completed', 'pending', 'failed');

-- 2. PROFILES TABLE
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. USER ROLES TABLE
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- 4. SCHOOL CLASSES
CREATE TABLE public.school_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  name_arabic TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('preparatory', 'primary')),
  instructor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. STUDENTS TABLE
CREATE TABLE public.students (
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
  guardian_name TEXT NOT NULL,
  guardian_phone TEXT NOT NULL,
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
CREATE TABLE public.results (
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
CREATE TABLE public.attendance (
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
CREATE TABLE public.payments (
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
CREATE TABLE public.announcements (
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
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_role app_role DEFAULT 'admin',
  is_published BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  cover_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 11. BLOG LIKES TABLE
CREATE TABLE public.blog_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(post_id, user_id)
);

-- 12. PASSWORD RESET REQUESTS
CREATE TABLE public.password_reset_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL REFERENCES public.students(student_id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rejected')),
  requested_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id)
);

-- 13. PARENT-STUDENT LINK TABLE
CREATE TABLE public.parent_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES public.students(student_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(parent_id, student_id)
);

-- 14. NOTIFICATIONS TABLE
CREATE TABLE public.notifications (
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

-- Quiz Houses (the 4 houses)
CREATE TABLE public.quiz_houses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  name_arabic TEXT NOT NULL,
  color TEXT NOT NULL,
  total_score INTEGER DEFAULT 0,
  competitions_won INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Quiz Questions (question bank managed by admin)
CREATE TABLE public.quiz_questions (
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

-- Quiz Competitions
CREATE TABLE public.quiz_competitions (
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

-- Quiz Representatives (assigned to a competition)
CREATE TABLE public.quiz_representatives (
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

-- Quiz Answers (submitted by representatives)
CREATE TABLE public.quiz_answers (
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

-- Quiz Competition Results (per-house scores after completion)
CREATE TABLE public.quiz_competition_results (
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
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email
  );
  IF NEW.raw_user_meta_data->>'role' IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, (NEW.raw_user_meta_data->>'role')::app_role);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_results_updated_at BEFORE UPDATE ON public.results FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
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
         '/admin/assignments'
  FROM public.user_roles ur WHERE ur.role = 'admin';
  RETURN NEW;
END;
$$;

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

-- PROFILES
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "System can insert profiles" ON public.profiles FOR INSERT WITH CHECK (TRUE);

-- USER ROLES
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can insert roles" ON public.user_roles FOR INSERT WITH CHECK (TRUE);

-- STUDENTS
CREATE POLICY "Admins full access to students" ON public.students FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Instructors can view assigned students" ON public.students FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.school_classes sc WHERE sc.name = students.class AND sc.instructor_id = auth.uid()));
CREATE POLICY "Students can view own record" ON public.students FOR SELECT TO authenticated USING (auth_user_id = auth.uid());
CREATE POLICY "Parents can view linked students" ON public.students FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.parent_students ps WHERE ps.parent_id = auth.uid() AND ps.student_id = students.student_id));

-- RESULTS
CREATE POLICY "Admins full access to results" ON public.results FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Instructors can manage assigned results" ON public.results FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.students s JOIN public.school_classes sc ON sc.name = s.class WHERE s.student_id = results.student_id AND sc.instructor_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.students s JOIN public.school_classes sc ON sc.name = s.class WHERE s.student_id = results.student_id AND sc.instructor_id = auth.uid()));
CREATE POLICY "Students can view own results" ON public.results FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.students s WHERE s.student_id = results.student_id AND s.auth_user_id = auth.uid()));
CREATE POLICY "Parents can view linked results" ON public.results FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.parent_students ps WHERE ps.parent_id = auth.uid() AND ps.student_id = results.student_id));

-- ATTENDANCE
CREATE POLICY "Admins full access to attendance" ON public.attendance FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Instructors can manage assigned attendance" ON public.attendance FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.students s JOIN public.school_classes sc ON sc.name = s.class WHERE s.student_id = attendance.student_id AND sc.instructor_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.students s JOIN public.school_classes sc ON sc.name = s.class WHERE s.student_id = attendance.student_id AND sc.instructor_id = auth.uid()));
CREATE POLICY "Students can view own attendance" ON public.attendance FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.students s WHERE s.student_id = attendance.student_id AND s.auth_user_id = auth.uid()));
CREATE POLICY "Parents can view linked attendance" ON public.attendance FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.parent_students ps WHERE ps.parent_id = auth.uid() AND ps.student_id = attendance.student_id));

-- PAYMENTS
CREATE POLICY "Admins full access to payments" ON public.payments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Students can view own payments" ON public.payments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.students s WHERE s.student_id = payments.student_id AND s.auth_user_id = auth.uid()));
CREATE POLICY "Parents can view linked payments" ON public.payments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.parent_students ps WHERE ps.parent_id = auth.uid() AND ps.student_id = payments.student_id));

-- ANNOUNCEMENTS
CREATE POLICY "Anyone authenticated can view active announcements" ON public.announcements FOR SELECT TO authenticated USING (is_active = TRUE);
CREATE POLICY "Public can view active announcements" ON public.announcements FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins full access to announcements" ON public.announcements FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- BLOG POSTS
CREATE POLICY "Anyone can view published posts" ON public.blog_posts FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Admins full access to blog" ON public.blog_posts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- BLOG LIKES
CREATE POLICY "Anyone can view likes" ON public.blog_likes FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can like" ON public.blog_likes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can unlike own likes" ON public.blog_likes FOR DELETE TO authenticated USING (user_id = auth.uid());

-- SCHOOL CLASSES
CREATE POLICY "Anyone authenticated can view classes" ON public.school_classes FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Admins can manage classes" ON public.school_classes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- PASSWORD RESET REQUESTS
CREATE POLICY "Students can create requests" ON public.password_reset_requests FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "Students can view own requests" ON public.password_reset_requests FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.students s WHERE s.student_id = password_reset_requests.student_id AND s.auth_user_id = auth.uid()));
CREATE POLICY "Admins can manage requests" ON public.password_reset_requests FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- PARENT STUDENTS
CREATE POLICY "Admins can manage parent-student links" ON public.parent_students FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Parents can view own links" ON public.parent_students FOR SELECT TO authenticated USING (parent_id = auth.uid());

-- NOTIFICATIONS
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete own notifications" ON public.notifications FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Authenticated can create notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (TRUE);

-- QUIZ HOUSES (public read, admin write)
CREATE POLICY "Anyone can view quiz houses" ON public.quiz_houses FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage quiz houses" ON public.quiz_houses FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- QUIZ QUESTIONS (admin full, public read for active competitions)
CREATE POLICY "Admins full access to quiz questions" ON public.quiz_questions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public can view quiz questions" ON public.quiz_questions FOR SELECT USING (TRUE);

-- QUIZ COMPETITIONS
CREATE POLICY "Anyone can view competitions" ON public.quiz_competitions FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage competitions" ON public.quiz_competitions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- QUIZ REPRESENTATIVES
CREATE POLICY "Anyone can view representatives" ON public.quiz_representatives FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage representatives" ON public.quiz_representatives FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- QUIZ ANSWERS
CREATE POLICY "Anyone can insert quiz answers" ON public.quiz_answers FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Anyone can view quiz answers" ON public.quiz_answers FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage quiz answers" ON public.quiz_answers FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- QUIZ COMPETITION RESULTS
CREATE POLICY "Anyone can view competition results" ON public.quiz_competition_results FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage competition results" ON public.quiz_competition_results FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =============================================================================
-- STORAGE - Avatar bucket
-- =============================================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can delete own avatar" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Public can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

-- =============================================================================
-- REALTIME - Enable for key tables
-- =============================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.students;
ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.results;
ALTER PUBLICATION supabase_realtime ADD TABLE public.blog_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.blog_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quiz_houses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quiz_competitions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quiz_representatives;

-- =============================================================================
-- SEED DATA - School Classes
-- =============================================================================

INSERT INTO public.school_classes (name, name_arabic, level) VALUES
  ('Safu Awwal', 'الصف الأول', 'preparatory'),
  ('Safu Thaniy', 'الصف الثاني', 'preparatory'),
  ('Safu Thalith', 'الصف الثالث', 'preparatory'),
  ('Awwal Ibtida''i', 'الأول ابتدائي', 'primary'),
  ('Thaniy Ibtida''i', 'الثاني ابتدائي', 'primary'),
  ('Thalith Ibtida''i', 'الثالث ابتدائي', 'primary');

-- SEED DATA - Quiz Houses
INSERT INTO public.quiz_houses (name, name_arabic, color) VALUES
  ('AbuBakr', 'أبو بكر', 'bg-emerald-500'),
  ('Umar', 'عمر', 'bg-blue-500'),
  ('Uthman', 'عثمان', 'bg-amber-500'),
  ('Ali', 'علي', 'bg-rose-500');

-- =============================================================================
-- PERFORMANCE INDEXES
-- =============================================================================

CREATE INDEX idx_students_student_id ON public.students(student_id);
CREATE INDEX idx_students_class ON public.students(class);
CREATE INDEX idx_students_auth_user ON public.students(auth_user_id);
CREATE INDEX idx_attendance_student_date ON public.attendance(student_id, date);
CREATE INDEX idx_results_student ON public.results(student_id);
CREATE INDEX idx_payments_student ON public.payments(student_id);
CREATE INDEX idx_blog_likes_post ON public.blog_likes(post_id);
CREATE INDEX idx_parent_students_parent ON public.parent_students(parent_id);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX idx_quiz_reps_competition ON public.quiz_representatives(competition_id);
CREATE INDEX idx_quiz_answers_competition ON public.quiz_answers(competition_id);

-- =============================================================================
-- ADMIN SETUP QUERIES (run after first signup)
-- =============================================================================
-- 1. Sign up as a staff member via the app
-- 2. Then run:
--    UPDATE public.user_roles SET role = 'admin' WHERE user_id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL');
--    If no role row exists yet:
--    INSERT INTO public.user_roles (user_id, role) VALUES ((SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL'), 'admin');
