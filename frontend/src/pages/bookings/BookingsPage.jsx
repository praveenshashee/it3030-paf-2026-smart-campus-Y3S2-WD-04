import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppNavbar from '../../components/AppNavbar';
import PageTransition from '../../components/PageTransition';
import { getAllBookings } from '../../services/bookingService';

function BookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await getAllBookings();
            setBookings(response.data);
            setError('');
        } catch (err) {
            setError('Failed to load bookings from the backend.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        if (status === 'APPROVED') return 'status-badge status-active';
        if (status === 'REJECTED' || status === 'CANCELLED') {
            return 'status-badge status-out';
        }
        return 'status-badge';
    };

    return (
        <PageTransition>
            <>
                <AppNavbar />

                <div className="page-shell">
                    <div className="page-header">
                        <h1>Bookings</h1>
                        <p>Manage booking requests for campus resources.</p>
                    </div>

                    <div className="top-actions">
                        <Link to="/bookings/create" className="btn btn-primary link-btn">
                            Create Booking
                        </Link>
                    </div>

                    {loading && <p>Loading bookings...</p>}
                    {error && <div className="alert alert-danger">{error}</div>}

                    {!loading && !error && (
                        <div className="glass-card table-card">
                            <div className="table-responsive">
                                <table className="table custom-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Resource</th>
                                            <th>Date</th>
                                            <th>Start</th>
                                            <th>End</th>
                                            <th>Purpose</th>
                                            <th>Attendees</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.length > 0 ? (
                                            bookings.map((booking) => (
                                                <tr key={booking.id}>
                                                    <td>{booking.id}</td>
                                                    <td>{booking.resourceName}</td>
                                                    <td>{booking.bookingDate}</td>
                                                    <td>{booking.startTime}</td>
                                                    <td>{booking.endTime}</td>
                                                    <td>{booking.purpose}</td>
                                                    <td>{booking.expectedAttendees}</td>
                                                    <td>
                                                        <span className={getStatusClass(booking.status)}>
                                                            {booking.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="empty-state">
                                                    No bookings found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </>
        </PageTransition>
    );
}

export default BookingsPage;