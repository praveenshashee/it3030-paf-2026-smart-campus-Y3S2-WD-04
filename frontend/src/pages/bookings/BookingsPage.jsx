import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppNavbar from '../../components/AppNavbar';
import PageTransition from '../../components/PageTransition';
import {
    approveBooking,
    cancelBooking,
    getAllBookings,
    rejectBooking,
} from '../../services/bookingService';

function BookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

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

    const handleApprove = async (id) => {
        try {
            await approveBooking(id);
            setSuccessMessage('Booking approved successfully.');
            setError('');
            fetchBookings();
        } catch (err) {
            setSuccessMessage('');
            setError('Failed to approve booking.');
            console.error(err);
        }
    };

    const handleReject = async (id) => {
        const reason = window.prompt('Enter a reason for rejecting this booking:');

        if (reason === null) {
            return;
        }

        try {
            await rejectBooking(id, reason);
            setSuccessMessage('Booking rejected successfully.');
            setError('');
            fetchBookings();
        } catch (err) {
            setSuccessMessage('');
            setError('Failed to reject booking.');
            console.error(err);
        }
    };

    const handleCancel = async (id) => {
        const reason = window.prompt('Enter a reason for cancelling this booking:');

        if (reason === null) {
            return;
        }

        try {
            await cancelBooking(id, reason);
            setSuccessMessage('Booking cancelled successfully.');
            setError('');
            fetchBookings();
        } catch (err) {
            setSuccessMessage('');
            setError('Failed to cancel booking.');
            console.error(err);
        }
    };

    const getStatusClass = (status) => {
        if (status === 'APPROVED') return 'status-badge status-active';
        if (status === 'REJECTED' || status === 'CANCELLED') {
            return 'status-badge status-out';
        }
        return 'status-badge';
    };

    const canApprove = (status) => status === 'PENDING';
    const canReject = (status) => status === 'PENDING';
    const canCancel = (status) => status === 'PENDING' || status === 'APPROVED';

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

                    {successMessage && (
                        <div className="alert alert-success">{successMessage}</div>
                    )}

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
                                            <th>Reason</th>
                                            <th style={{ width: '220px' }}>Actions</th>
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
                                                    <td>{booking.adminReason || '-'}</td>
                                                    <td>
                                                        <div className="action-group booking-action-group">
                                                            {canApprove(booking.status) && (
                                                                <button
                                                                    className="btn btn-success btn-sm"
                                                                    onClick={() => handleApprove(booking.id)}
                                                                >
                                                                    Approve
                                                                </button>
                                                            )}

                                                            {canReject(booking.status) && (
                                                                <button
                                                                    className="btn btn-warning btn-sm"
                                                                    onClick={() => handleReject(booking.id)}
                                                                >
                                                                    Reject
                                                                </button>
                                                            )}

                                                            {canCancel(booking.status) && (
                                                                <button
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => handleCancel(booking.id)}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="10" className="empty-state">
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