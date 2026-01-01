import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/features/auth/AuthContext";
import { ThemeProvider } from "@/features/app/ThemeContext";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";

// Pages
import Landing from "./pages/Landing";
import About from "./pages/About";
import Curriculum from "./pages/Curriculum";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

// Admin
import { AdminLayout } from "@/features/admin/AdminLayout";
import { AdminDashboard } from "@/features/admin/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="students" element={<AdminDashboard />} />
                <Route path="attendance" element={<AdminDashboard />} />
                <Route path="finance" element={<AdminDashboard />} />
                <Route path="results" element={<AdminDashboard />} />
                <Route path="announcements" element={<AdminDashboard />} />
                <Route path="settings" element={<AdminDashboard />} />
              </Route>

              {/* Instructor Routes */}
              <Route path="/instructor" element={
                <ProtectedRoute allowedRoles={['instructor']}>
                  <div className="p-8 text-center">Teacher Dashboard - Coming Soon</div>
                </ProtectedRoute>
              } />

              {/* Learner Routes */}
              <Route path="/learner" element={
                <ProtectedRoute allowedRoles={['learner']}>
                  <div className="p-8 text-center">Student Dashboard - Coming Soon</div>
                </ProtectedRoute>
              } />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
