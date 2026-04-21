import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AppNavbar from '../../components/AppNavbar';
import PageTransition from '../../components/PageTransition';
import {
    approveBooking,
    cancelBooking,
    getAllBookings,
    rejectBooking,
} from '../../services/bookingService';
import { formatDate, formatTime } from '../../utils/formatters';

function BookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const [bookingActionModal, setBookingActionModal] = useState({
        open: false,
        booking: null,
        action: '',
        reason: '',
    });

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

    const openBookingActionModal = (booking, action) => {
        setBookingActionModal({
            open: true,
            booking,
            action,
            reason: '',
        });
    };

    const closeBookingActionModal = () => {
        setBookingActionModal({
            open: false,
            booking: null,
            action: '',
            reason: '',
        });
    };

    const handleBookingActionConfirm = async () => {
        const { booking, action, reason } = bookingActionModal;

        if (!booking) {
            return;
        }

        if (!reason.trim()) {
            setError('Please enter a reason before continuing.');
            return;
        }

        try {
            if (action === 'reject') {
                await rejectBooking(booking.id, reason);
                setSuccessMessage('Booking rejected successfully.');
            }

            if (action === 'cancel') {
                await cancelBooking(booking.id, reason);
                setSuccessMessage('Booking cancelled successfully.');
            }

            setError('');
            closeBookingActionModal();
            fetchBookings();
        } catch (err) {
            setSuccessMessage('');
            setError('Failed to update booking.');
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

    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(
        (booking) => booking.status === 'PENDING'
    ).length;
    const approvedBookings = bookings.filter(
        (booking) => booking.status === 'APPROVED'
    ).length;

    const filteredBookings = useMemo(() => {
        return bookings.filter((booking) => {
            const matchesSearch =
                booking.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.purpose.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus =
                selectedStatus === '' || booking.status === selectedStatus;

            return matchesSearch && matchesStatus;
        });
    }, [bookings, searchTerm, selectedStatus]);

    const isRejectAction = bookingActionModal.action === 'reject';

    return (
        <PageTransition>
            <>
                <AppNavbar />

                <div className="page-shell">
                    <div className="page-header">
                        <h1>Bookings</h1>
                        <p>Manage booking requests for campus resources.</p>
                    </div>

                    <div className="summary-grid">
                        <div className="glass-card summary-card">
                            <span className="summary-label">Total Bookings</span>
                            <strong className="summary-value">{totalBookings}</strong>
                        </div>

                        <div className="glass-card summary-card">
                            <span className="summary-label">Pending</span>
                            <strong className="summary-value">{pendingBookings}</strong>
                        </div>

                        <div className="glass-card summary-card">
                            <span className="summary-label">Approved</span>
                            <strong className="summary-value">{approvedBookings}</strong>
                        </div>
                    </div>

                    <div className="glass-card filter-toolbar">
                        <div className="filter-toolbar-grid bookings-toolbar-grid">
                            <div className="filter-field filter-field-search">
                                <label className="form-label compact-label">Search</label>
                                <input
                                    type="text"
                                    className="form-control compact-control"
                                    placeholder="Search by resource or purpose"
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                />
                            </div>

                            <div className="filter-field">
                                <label className="form-label compact-label">Status</label>
                                <select
                                    className="form-select compact-control"
                                    value={selectedStatus}
                                    onChange={(event) => setSelectedStatus(event.target.value)}
                                >
                                    <option value="">All Statuses</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="APPROVED">Approved</option>
                                    <option value="REJECTED">Rejected</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </div>

                            <div className="filter-action">
                                <Link to="/bookings/create" className="btn btn-primary link-btn w-100">
                                    Create Booking
                                </Link>
                            </div>
                        </div>
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
                                        {filteredBookings.length > 0 ? (
                                            filteredBookings.map((booking) => (
                                                <tr key={booking.id}>
                                                    <td>{booking.id}</td>
                                                    <td>{booking.resourceName}</td>
                                                    <td>{formatDate(booking.bookingDate)}</td>
                                                    <td>{formatTime(booking.startTime)}</td>
                                                    <td>{formatTime(booking.endTime)}</td>
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
                                                                    onClick={() =>
                                                                        openBookingActionModal(booking, 'reject')
                                                                    }
                                                                >
                                                                    Reject
                                                                </button>
                                                            )}

                                                            {canCancel(booking.status) && (
                                                                <button
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() =>
                                                                        openBookingActionModal(booking, 'cancel')
                                                                    }
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
                                                <td colSpan="10">
                                                    <div className="empty-state-card">
                                                        <h3 className="empty-state-title">No bookings found</h3>
                                                        <p className="empty-state-text">
                                                            No bookings match the current search or filter settings.
                                                        </p>
                                                        <div className="empty-state-actions">
                                                            <Link to="/bookings/create" className="btn btn-primary link-btn">
                                                                Create Booking
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {bookingActionModal.open && (
                    <div className="custom-modal-overlay">
                        <div className="glass-card custom-modal-card">
                            <h3 className="custom-modal-title">
                                {isRejectAction ? 'Reject Booking' : 'Cancel Booking'}
                            </h3>

                            <p className="custom-modal-text">
                                {isRejectAction
                                    ? 'Provide a reason for rejecting this booking request.'
                                    : 'Provide a reason for cancelling this booking.'}
                            </p>

                            <textarea
                                className="form-control modal-textarea"
                                rows="4"
                                placeholder={
                                    isRejectAction
                                        ? 'Enter rejection reason'
                                        : 'Enter cancellation reason'
                                }
                                value={bookingActionModal.reason}
                                onChange={(event) =>
                                    setBookingActionModal((previous) => ({
                                        ...previous,
                                        reason: event.target.value,
                                    }))
                                }
                            />

                            <div className="custom-modal-actions">
                                <button
                                    className="btn btn-secondary"
                                    onClick={closeBookingActionModal}
                                >
                                    Cancel
                                </button>

                                <button
                                    className={`btn ${isRejectAction ? 'btn-warning' : 'btn-danger'}`}
                                    onClick={handleBookingActionConfirm}
                                >
                                    {isRejectAction ? 'Reject Booking' : 'Cancel Booking'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        </PageTransition>
    );
}

export default BookingsPage;