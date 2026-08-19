import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { HomePage } from './pages/HomePage';
import { DoctorsPage } from './pages/DoctorsPage';
import { DoctorDetailPage } from './pages/DoctorDetailPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { DepartmentDetailPage } from './pages/DepartmentDetailPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { MjpjayPage } from './pages/MjpjayPage';
import { InsurancePage } from './pages/InsurancePage';
import { EventsPage } from './pages/EventsPage';
import { ContactPage } from './pages/ContactPage';
import { BookAppointmentPage } from './pages/BookAppointmentPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminDoctorsPage } from './pages/admin/AdminDoctorsPage';
import { AdminDepartmentsPage } from './pages/admin/AdminDepartmentsPage';
import { AdminSchedulesPage } from './pages/admin/AdminSchedulesPage';
import { AdminAppointmentsPage } from './pages/admin/AdminAppointmentsPage';
import { AdminPaymentsPage } from './pages/admin/AdminPaymentsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminSchemesPage } from './pages/admin/AdminSchemesPage';
import { AdminReviewsEventsPage } from './pages/admin/AdminReviewsEventsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAdminAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Patient Website Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="doctors" element={<DoctorsPage />} />
              <Route path="doctors/:doctorId" element={<DoctorDetailPage />} />
              <Route path="departments" element={<DepartmentsPage />} />
              <Route path="departments/:slug" element={<DepartmentDetailPage />} />
              <Route path="facilities" element={<FacilitiesPage />} />
              <Route path="mjpjay" element={<MjpjayPage />} />
              <Route path="insurance" element={<InsurancePage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="book" element={<BookAppointmentPage />} />
            </Route>

            {/* Admin Authentication Route */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Hospital Admin Portal (Protected) */}
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="doctors" element={<AdminDoctorsPage />} />
              <Route path="departments" element={<AdminDepartmentsPage />} />
              <Route path="schedules" element={<AdminSchedulesPage />} />
              <Route path="appointments" element={<AdminAppointmentsPage />} />
              <Route path="payments" element={<AdminPaymentsPage />} />
              <Route path="schemes" element={<AdminSchemesPage />} />
              <Route path="reviews-events" element={<AdminReviewsEventsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* Fallback Catch-All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
};

export default App;
