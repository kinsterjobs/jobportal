
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { JobProvider } from '@/contexts/JobContext';

// Layouts
import MainLayout from '@/components/layouts/MainLayout';
import AdminLayout from '@/components/layouts/AdminLayout';

// Pages
import HomePage from '@/pages/HomePage';
import JobsPage from '@/pages/JobsPage';
import JobDetailPage from '@/pages/JobDetailPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProfilePage from '@/pages/ProfilePage';
import ApplicationsPage from '@/pages/ApplicationsPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminJobs from '@/pages/admin/Jobs';
import AdminApplications from '@/pages/admin/Applications';
import AdminUsers from '@/pages/admin/Users';

// Auth Guard
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminRoute from '@/components/auth/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <JobProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/applications" element={<ApplicationsPage />} />
            </Route>
          </Route>
          
          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/superadmin" element={<AdminDashboard />} />
              <Route path="/superadmin/jobs" element={<AdminJobs />} />
              <Route path="/superadmin/applications" element={<AdminApplications />} />
              <Route path="/superadmin/users" element={<AdminUsers />} />
            </Route>
          </Route>
          
          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster />
      </JobProvider>
    </AuthProvider>
  );
}

export default App;
