import { useEffect, useState } from 'react';
import AppNavbar from '../../components/AppNavbar';
import PageTransition from '../../components/PageTransition';
import { formatDateTime } from '../../utils/formatters';
import {
    getAllNotifications,
    markNotificationAsRead,
} from '../../services/notificationService';

function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await getAllNotifications();
            setNotifications(response.data);
            setError('');
        } catch (err) {
            setError('Failed to load notifications from the backend.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationAsRead(id);
            setSuccessMessage('Notification marked as read.');
            setError('');
            fetchNotifications();
        } catch (err) {
            setSuccessMessage('');
            setError('Failed to update notification.');
            console.error(err);
        }
    };

    const getTypeClass = (type) => {
        if (type === 'BOOKING') return 'notification-type-badge notification-booking';
        if (type === 'TICKET') return 'notification-type-badge notification-ticket';
        return 'notification-type-badge notification-general';
    };

    return (
        <PageTransition>
            <>
                <AppNavbar />

                <div className="page-shell">
                    <div className="page-header">
                        <h1>Notifications</h1>
                        <p>Track booking and ticket activity across the system.</p>
                    </div>

                    {successMessage && (
                        <div className="alert alert-success">{successMessage}</div>
                    )}

                    {loading && <p>Loading notifications...</p>}
                    {error && <div className="alert alert-danger">{error}</div>}

                    {!loading && !error && (
                        <div className="notification-list">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`glass-card notification-card ${notification.isRead
                                            ? 'notification-read'
                                            : 'notification-unread'
                                            }`}
                                    >
                                        <div className="notification-card-top">
                                            <span className={getTypeClass(notification.type)}>
                                                {notification.type}
                                            </span>

                                            {!notification.isRead && (
                                                <span className="notification-unread-dot">Unread</span>
                                            )}
                                        </div>

                                        <h3 className="notification-title">{notification.title}</h3>

                                        <p className="notification-message">{notification.message}</p>

                                        <div className="notification-footer">
                                            <span className="notification-time">
                                                {formatDateTime(notification.createdAt)}
                                            </span>

                                            {!notification.isRead && (
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                >
                                                    Mark as Read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="glass-card notification-card empty-state-card">
                                    <h3 className="empty-state-title">No notifications yet</h3>
                                    <p className="empty-state-text mb-0">
                                        Booking and ticket activity will appear here once actions are performed.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </>
        </PageTransition>
    );
}

export default NotificationsPage;