import { Link, NavLink } from 'react-router-dom';

function AppNavbar() {
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
                </div>
            </div>
        </div>
    );
}

export default AppNavbar;