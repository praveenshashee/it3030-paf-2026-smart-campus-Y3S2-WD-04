import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ResourcesPage from './pages/resources/ResourcesPage';
import CreateResourcePage from './pages/resources/CreateResourcePage';
import EditResourcePage from './pages/resources/EditResourcePage';
import BookingsPage from './pages/bookings/BookingsPage';
import CreateBookingPage from './pages/bookings/CreateBookingPage';
import TicketsPage from './pages/tickets/TicketsPage';
import CreateTicketPage from './pages/tickets/CreateTicketPage';
import NotificationsPage from './pages/notifications/NotificationsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/resources/create" element={<CreateResourcePage />} />
      <Route path="/resources/edit/:id" element={<EditResourcePage />} />
      <Route path="/bookings" element={<BookingsPage />} />
      <Route path="/bookings/create" element={<CreateBookingPage />} />
      <Route path="/tickets" element={<TicketsPage />} />
      <Route path="/tickets/create" element={<CreateTicketPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
    </Routes>
  );
}

export default App;