import { Link, NavLink } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { getAllNotifications } from '../services/notificationService';
import { useAuth } from '../context/AuthContext';

function AppNavbar() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const { user, logout } = useAuth();
    const profileMenuRef = useRef(null);

    useEffect(() => {
        if (!user) {
            setUnreadCount(0);
            return;
        }

        fetchUnreadNotifications();
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileMenuRef.current &&
                !profileMenuRef.current.contains(event.target)
            ) {
                setProfileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
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

    const getInitials = (name) => {
        if (!name) return 'U';

        return name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0].toUpperCase())
            .join('');
    };

    const handleLogoutClick = () => {
        setProfileMenuOpen(false);
        setShowLogoutModal(true);
    };

    const confirmLogout = async () => {
        setShowLogoutModal(false);
        await logout();
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    return (
        <>
            <div className="app-navbar-shell">
                <div className="page-shell app-navbar">
                    <Link to="/" className="app-brand">
                        Smart Campus Hub
                    </Link>

                    <div className="app-nav-links">
                        {user && (
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) =>
                                    `app-nav-link ${isActive ? 'active' : ''}`
                                }
                            >
                                Dashboard
                            </NavLink>
                        )}

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

                        {user && (
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
                        )}
                    </div>

                    <div className="navbar-auth-section">
                        {user ? (
                            <div className="profile-menu-wrapper" ref={profileMenuRef}>
                                <button
                                    className="profile-menu-trigger"
                                    onClick={() => setProfileMenuOpen((previous) => !previous)}
                                    aria-label="Open profile menu"
                                    title="Profile"
                                >
                                    {user.profileImageUrl ? (
                                        <img
                                            src={user.profileImageUrl}
                                            alt={user.fullName}
                                            className="profile-menu-avatar-image"
                                        />
                                    ) : (
                                        <span className="profile-menu-avatar-fallback">
                                            {getInitials(user.fullName)}
                                        </span>
                                    )}
                                </button>

                                {profileMenuOpen && (
                                    <div className="profile-dropdown-menu">
                                        <div className="profile-dropdown-header">
                                            {user.profileImageUrl ? (
                                                <img
                                                    src={user.profileImageUrl}
                                                    alt={user.fullName}
                                                    className="profile-dropdown-avatar-image"
                                                />
                                            ) : (
                                                <div className="profile-dropdown-avatar-fallback">
                                                    {getInitials(user.fullName)}
                                                </div>
                                            )}

                                            <div className="profile-dropdown-user-info">
                                                <strong className="profile-dropdown-name">
                                                    {user.fullName}
                                                </strong>
                                                <span className="profile-dropdown-role">{user.role}</span>
                                            </div>
                                        </div>

                                        <div className="profile-dropdown-actions">
                                            <Link
                                                to="/dashboard"
                                                className="btn btn-primary btn-sm link-btn w-100"
                                                onClick={() => setProfileMenuOpen(false)}
                                            >
                                                Dashboard
                                            </Link>

                                            <Link
                                                to="/profile"
                                                className="btn btn-secondary btn-sm link-btn w-100"
                                                onClick={() => setProfileMenuOpen(false)}
                                            >
                                                Profile
                                            </Link>

                                            {user.role === 'ADMIN' && (
                                                <Link
                                                    to="/admin/users"
                                                    className="btn btn-secondary btn-sm link-btn w-100"
                                                    onClick={() => setProfileMenuOpen(false)}
                                                >
                                                    Manage Users
                                                </Link>
                                            )}

                                            <button
                                                className="btn btn-secondary btn-sm w-100"
                                                onClick={handleLogoutClick}
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-primary btn-sm link-btn">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {showLogoutModal && (
                <div className="custom-modal-overlay">
                    <div className="glass-card custom-modal-card">
                        <h3 className="custom-modal-title">Confirm Logout</h3>

                        <p className="custom-modal-text">
                            Are you sure you want to log out of your account?
                        </p>

                        <div className="custom-modal-actions">
                            <button className="btn btn-secondary" onClick={cancelLogout}>
                                Stay Logged In
                            </button>

                            <button className="btn btn-danger" onClick={confirmLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AppNavbar;
