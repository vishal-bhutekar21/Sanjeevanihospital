import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HOSPITAL } from './config/hospital';

// The admin address (e.g. sanjeevani-admin.…) opens the staff login instead of the home page
const isAdminHost = typeof window !== 'undefined' && window.location.hostname === HOSPITAL.domains.admin;
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
import { AdminStaffPage } from './pages/admin/AdminStaffPage';
import { AdminPatientRecordsPage } from './pages/admin/AdminPatientRecordsPage';
import { AdminStaffLoginsPage } from './pages/admin/AdminStaffLoginsPage';
import { AdminRegistrationPage } from './pages/admin/AdminRegistrationPage';
import { AdminNewAppointmentPage } from './pages/admin/AdminNewAppointmentPage';
import { AdminReceiptsPage } from './pages/admin/AdminReceiptsPage';
import { AdminReceiptFormPage } from './pages/admin/AdminReceiptFormPage';
import { AdminReceiptDetailPage } from './pages/admin/AdminReceiptDetailPage';
import { PatientPortalPage } from './pages/PatientPortalPage';
import { isAdminRole, isReceptionRole } from './lib/reception';

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

// Pages only for administrators / only for people who work at the front desk.
// (The server enforces the same rules; this just keeps people off screens that would not work.)
const AdminOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { admin } = useAdminAuth();
  return isAdminRole(admin?.role) ? <>{children}</> : <Navigate to="/admin" replace />;
};
const ReceptionOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { admin } = useAdminAuth();
  return isReceptionRole(admin?.role) ? <>{children}</> : <Navigate to="/admin" replace />;
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Patient Website Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={isAdminHost ? <Navigate to="/admin" replace /> : <HomePage />} />
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
              <Route path="patient" element={<PatientPortalPage />} />
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
              <Route path="departments" element={<AdminOnly><AdminDepartmentsPage /></AdminOnly>} />
              <Route path="schedules" element={<AdminSchedulesPage />} />
              <Route path="appointments" element={<AdminAppointmentsPage />} />
              <Route path="appointments/new" element={<ReceptionOnly><AdminNewAppointmentPage /></ReceptionOnly>} />
              <Route path="registration" element={<ReceptionOnly><AdminRegistrationPage /></ReceptionOnly>} />
              <Route path="receipts" element={<ReceptionOnly><AdminReceiptsPage /></ReceptionOnly>} />
              <Route path="receipts/new" element={<ReceptionOnly><AdminReceiptFormPage /></ReceptionOnly>} />
              <Route path="receipts/:id" element={<ReceptionOnly><AdminReceiptDetailPage /></ReceptionOnly>} />
              <Route path="payments" element={<ReceptionOnly><AdminPaymentsPage /></ReceptionOnly>} />
              <Route path="schemes" element={<AdminOnly><AdminSchemesPage /></AdminOnly>} />
              <Route path="reviews-events" element={<AdminOnly><AdminReviewsEventsPage /></AdminOnly>} />
              <Route path="staff" element={<AdminOnly><AdminStaffPage /></AdminOnly>} />
              <Route path="logins" element={<AdminOnly><AdminStaffLoginsPage /></AdminOnly>} />
              <Route path="patients" element={<AdminPatientRecordsPage />} />
              <Route path="settings" element={<AdminOnly><AdminSettingsPage /></AdminOnly>} />
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
