import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAllNotifications } from '../services/notificationService';

function AppNavbar() {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchUnreadNotifications();
    }, []);

    const fetchUnreadNotifications = async () => {
        try {
            const response = await getAllNotifications();

            const unreadNotifications = response.data.filter(
                (notification) => !notification.isRead
            );

            setUnreadCount(unreadNotifications.length);
        } catch (error) {
            console.error('Failed to load notification count.', error);
        }
    };

    return (
        <div className="app-navbar-shell">
            <div className="page-shell app-navbar">
                <Link to="/" className="app-brand">
                    Smart Campus Hub
                </Link>

                <div className="app-nav-links">
                    <NavLink
                        to="/resources"
                        className={({ isActive }) =>
                            `app-nav-link ${isActive ? 'active' : ''}`
                        }
                    >
                        Resources
                    </NavLink>

                    <NavLink
                        to="/bookings"
                        className={({ isActive }) =>
                            `app-nav-link ${isActive ? 'active' : ''}`
                        }
                    >
                        Bookings
                    </NavLink>

                    <NavLink
                        to="/tickets"
                        className={({ isActive }) =>
                            `app-nav-link ${isActive ? 'active' : ''}`
                        }
                    >
                        Tickets
                    </NavLink>

                    <NavLink
                        to="/notifications"
                        className={({ isActive }) =>
                            `notification-bell-btn ${isActive ? 'active' : ''}`
                        }
                        aria-label="Notifications"
                        title="Notifications"
                    >
                        <span className="notification-bell-icon">🔔</span>

                        {unreadCount > 0 && (
                            <span className="notification-badge">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

export default AppNavbar;