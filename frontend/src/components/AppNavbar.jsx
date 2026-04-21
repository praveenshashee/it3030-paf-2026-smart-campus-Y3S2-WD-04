import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAllNotifications } from '../services/notificationService';
import { useAuth } from '../context/AuthContext';

function AppNavbar() {
    const [unreadCount, setUnreadCount] = useState(0);
    const { user, logout } = useAuth();

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

                <div className="app-navbar-actions">
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

                    <div className="navbar-auth-section">
                        {user ? (
                            <>
                                <Link to="/profile" className="navbar-user-box navbar-user-link">
                                    <span className="navbar-user-name">{user.fullName}</span>
                                    <span className="navbar-user-role">{user.role}</span>
                                </Link>

                                <button className="btn btn-secondary btn-sm" onClick={logout}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="btn btn-primary btn-sm link-btn">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AppNavbar;
