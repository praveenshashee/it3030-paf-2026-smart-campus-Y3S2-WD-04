import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import PageTransition from '../components/PageTransition';
import { useAuth } from '../context/AuthContext';
import { getAllBookings } from '../services/bookingService';
import { getAllNotifications } from '../services/notificationService';
import { getAllResources } from '../services/resourceService';
import { getAllTickets } from '../services/ticketService';

function DashboardPage() {
    const { user } = useAuth();

    const [resources, setResources] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [
                resourcesResponse,
                bookingsResponse,
                ticketsResponse,
                notificationsResponse,
            ] = await Promise.all([
                getAllResources(),
                getAllBookings(),
                getAllTickets(),
                getAllNotifications(),
            ]);

            setResources(resourcesResponse.data);
            setBookings(bookingsResponse.data);
            setTickets(ticketsResponse.data);
            setNotifications(notificationsResponse.data);
            setError('');
        } catch (err) {
            setError('Failed to load dashboard data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const stats = useMemo(() => {
        const unreadNotifications = notifications.filter(
            (notification) => !notification.isRead
        ).length;

        if (user?.role === 'ADMIN') {
            return [
                { label: 'Total Resources', value: resources.length, to: '/resources' },
                {
                    label: 'Pending Bookings',
                    value: bookings.filter((booking) => booking.status === 'PENDING').length,
                    to: '/bookings',
                },
                {
                    label: 'Open Tickets',
                    value: tickets.filter(
                        (ticket) => ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS'
                    ).length,
                    to: '/tickets',
                },
                { label: 'Unread Notifications', value: unreadNotifications, to: '/notifications' },
            ];
        }

        if (user?.role === 'TECHNICIAN') {
            return [
                { label: 'Assigned Tickets', value: tickets.length, to: '/tickets' },
                {
                    label: 'In Progress',
                    value: tickets.filter((ticket) => ticket.status === 'IN_PROGRESS').length,
                    to: '/tickets',
                },
                {
                    label: 'Resolved / Closed',
                    value: tickets.filter(
                        (ticket) => ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'
                    ).length,
                    to: '/tickets',
                },
                { label: 'Unread Notifications', value: unreadNotifications, to: '/notifications' },
            ];
        }

        return [
            { label: 'My Bookings', value: bookings.length, to: '/bookings' },
            {
                label: 'Pending Bookings',
                value: bookings.filter((booking) => booking.status === 'PENDING').length,
                to: '/bookings',
            },
            { label: 'My Tickets', value: tickets.length, to: '/tickets' },
            { label: 'Unread Notifications', value: unreadNotifications, to: '/notifications' },
        ];
    }, [bookings, notifications, resources, tickets, user]);

    const latestNotifications = notifications.slice(0, 3);
    const activeBookings = bookings.filter(
        (booking) => booking.status === 'PENDING' || booking.status === 'APPROVED'
    ).slice(0, 4);
    const activeTickets = tickets.filter(
        (ticket) => ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS'
    ).slice(0, 4);

    const roleTitle = {
        ADMIN: 'Admin Dashboard',
        TECHNICIAN: 'Technician Dashboard',
        USER: 'User Dashboard',
    }[user?.role] || 'Dashboard';

    return (
        <PageTransition>
            <>
                <AppNavbar />

                <div className="page-shell">
                    <div className="page-header dashboard-header">
                        <div>
                            <h1>{roleTitle}</h1>
                            <p>Track the work that matters most for your role.</p>
                        </div>

                        <Link to="/notifications" className="btn btn-primary link-btn">
                            View Notifications
                        </Link>
                    </div>

                    {loading && <p>Loading dashboard...</p>}
                    {error && <div className="alert alert-danger">{error}</div>}

                    {!loading && !error && (
                        <>
                            <div className="dashboard-stat-grid">
                                {stats.map((item) => (
                                    <Link
                                        key={item.label}
                                        to={item.to}
                                        className="glass-card dashboard-stat-card"
                                    >
                                        <span className="summary-label">{item.label}</span>
                                        <strong className="summary-value">{item.value}</strong>
                                    </Link>
                                ))}
                            </div>

                            <div className="dashboard-panel-grid">
                                <section className="glass-card dashboard-panel">
                                    <div className="dashboard-panel-header">
                                        <h2>Active Bookings</h2>
                                        <Link to="/bookings" className="dashboard-panel-link">
                                            View all
                                        </Link>
                                    </div>

                                    {activeBookings.length > 0 ? (
                                        <div className="dashboard-list">
                                            {activeBookings.map((booking) => (
                                                <div key={booking.id} className="dashboard-list-item">
                                                    <div>
                                                        <strong>{booking.resourceName}</strong>
                                                        <span>
                                                            {booking.bookingDate} - {booking.startTime?.slice(0, 5)}-{booking.endTime?.slice(0, 5)}
                                                        </span>
                                                    </div>
                                                    <span className="status-badge status-pending">
                                                        {booking.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="dashboard-empty-text">No active bookings.</p>
                                    )}
                                </section>

                                <section className="glass-card dashboard-panel">
                                    <div className="dashboard-panel-header">
                                        <h2>Active Tickets</h2>
                                        <Link to="/tickets" className="dashboard-panel-link">
                                            View all
                                        </Link>
                                    </div>

                                    {activeTickets.length > 0 ? (
                                        <div className="dashboard-list">
                                            {activeTickets.map((ticket) => (
                                                <div key={ticket.id} className="dashboard-list-item">
                                                    <div>
                                                        <strong>{ticket.category}</strong>
                                                        <span>{ticket.locationText}</span>
                                                    </div>
                                                    <span className="status-badge status-in-progress">
                                                        {ticket.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="dashboard-empty-text">No active tickets.</p>
                                    )}
                                </section>

                                <section className="glass-card dashboard-panel dashboard-panel-wide">
                                    <div className="dashboard-panel-header">
                                        <h2>Latest Notifications</h2>
                                        <Link to="/notifications" className="dashboard-panel-link">
                                            View inbox
                                        </Link>
                                    </div>

                                    {latestNotifications.length > 0 ? (
                                        <div className="dashboard-list">
                                            {latestNotifications.map((notification) => (
                                                <div key={notification.id} className="dashboard-list-item">
                                                    <div>
                                                        <strong>{notification.title}</strong>
                                                        <span>{notification.message}</span>
                                                    </div>
                                                    {!notification.isRead && (
                                                        <span className="notification-unread-dot">Unread</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="dashboard-empty-text">No notifications yet.</p>
                                    )}
                                </section>
                            </div>
                        </>
                    )}
                </div>
            </>
        </PageTransition>
    );
}

export default DashboardPage;
