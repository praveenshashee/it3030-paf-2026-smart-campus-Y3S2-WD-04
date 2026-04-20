import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ResourcesPage from './pages/resources/ResourcesPage';
import CreateResourcePage from './pages/resources/CreateResourcePage';
import EditResourcePage from './pages/resources/EditResourcePage';
import BookingsPage from './pages/bookings/BookingsPage';
import CreateBookingPage from './pages/bookings/CreateBookingPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/resources/create" element={<CreateResourcePage />} />
      <Route path="/resources/edit/:id" element={<EditResourcePage />} />
      <Route path="/bookings" element={<BookingsPage />} />
      <Route path="/bookings/create" element={<CreateBookingPage />} />
    </Routes>
  );
}

export default App;