import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ResourcesPage from './pages/resources/ResourcesPage';
import CreateResourcePage from './pages/resources/CreateResourcePage';
import EditResourcePage from './pages/resources/EditResourcePage';
import BookingsPage from './pages/bookings/BookingsPage';
import CreateBookingPage from './pages/bookings/CreateBookingPage';
import TicketsPage from './pages/tickets/TicketsPage';
import CreateTicketPage from './pages/tickets/CreateTicketPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import ProfilePage from './pages/ProfilePage';
import AdminUsersPage from './pages/AdminUsersPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route path="/resources" element={<ResourcesPage />} />
      <Route
        path="/resources/create"
        element={
          <RoleProtectedRoute allowedRoles={['ADMIN']}>
            <CreateResourcePage />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/resources/edit/:id"
        element={
          <RoleProtectedRoute allowedRoles={['ADMIN']}>
            <EditResourcePage />
          </RoleProtectedRoute>
        }
      />

      <Route path="/bookings" element={<BookingsPage />} />
      <Route
        path="/bookings/create"
        element={
          <ProtectedRoute>
            <CreateBookingPage />
          </ProtectedRoute>
        }
      />

      <Route path="/tickets" element={<TicketsPage />} />
      <Route
        path="/tickets/create"
        element={
          <ProtectedRoute>
            <CreateTicketPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <RoleProtectedRoute allowedRoles={['ADMIN']}>
            <AdminUsersPage />
          </RoleProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
