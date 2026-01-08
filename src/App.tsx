/**
 * App.tsx - Root application component with routing
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/features/auth/AuthContext";
import { ThemeProvider } from "@/features/app/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";

// Public Pages
import Landing from "./pages/Landing";
import About from "./pages/About";
import Curriculum from "./pages/Curriculum";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Quiz from "./pages/Quiz";
import QuizTake from "./pages/QuizTake";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

// Admin
import { AdminLayout } from "@/features/admin/AdminLayout";
import { AdminDashboard } from "@/features/admin/AdminDashboard";
import { StudentsPage } from "@/features/admin/StudentsPage";
import { AttendancePage } from "@/features/admin/AttendancePage";
import { FinancePage } from "@/features/admin/FinancePage";
import { ResultsPage } from "@/features/admin/ResultsPage";
import { AnnouncementsPage } from "@/features/admin/AnnouncementsPage";
import { SettingsPage } from "@/features/admin/SettingsPage";
import { AdminQuizPage } from "@/features/admin/AdminQuizPage";

// Learner
import { LearnerLayout } from "@/features/learner/LearnerLayout";
import { LearnerDashboard } from "@/features/learner/LearnerDashboard";
import { LearnerProfile } from "@/features/learner/LearnerProfile";
import { LearnerAttendance } from "@/features/learner/LearnerAttendance";
import { LearnerResults } from "@/features/learner/LearnerResults";
import { LearnerFees } from "@/features/learner/LearnerFees";

// Instructor
import { InstructorLayout } from "@/features/instructor/InstructorLayout";
import { InstructorDashboard } from "@/features/instructor/InstructorDashboard";
import { InstructorClasses } from "@/features/instructor/InstructorClasses";
import { InstructorAttendance } from "@/features/instructor/InstructorAttendance";
import { InstructorResults } from "@/features/instructor/InstructorResults";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/about" element={<About />} />
                <Route path="/curriculum" element={<Curriculum />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/quiz/take" element={<QuizTake />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="students" element={<StudentsPage />} />
                <Route path="attendance" element={<AttendancePage />} />
                <Route path="finance" element={<FinancePage />} />
                <Route path="results" element={<ResultsPage />} />
                <Route path="quiz" element={<AdminQuizPage />} />
                <Route path="announcements" element={<AnnouncementsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Instructor Routes */}
              <Route path="/instructor" element={
                <ProtectedRoute allowedRoles={['instructor']}>
                  <InstructorLayout />
                </ProtectedRoute>
              }>
                <Route index element={<InstructorDashboard />} />
                <Route path="classes" element={<InstructorClasses />} />
                <Route path="attendance" element={<InstructorAttendance />} />
                <Route path="results" element={<InstructorResults />} />
              </Route>

              {/* Learner Routes */}
              <Route path="/learner" element={
                <ProtectedRoute allowedRoles={['learner']}>
                  <LearnerLayout />
                </ProtectedRoute>
              }>
                <Route index element={<LearnerDashboard />} />
                <Route path="profile" element={<LearnerProfile />} />
                <Route path="attendance" element={<LearnerAttendance />} />
                <Route path="results" element={<LearnerResults />} />
                <Route path="fees" element={<LearnerFees />} />
              </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
