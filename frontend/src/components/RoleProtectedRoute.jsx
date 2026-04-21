import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RoleProtectedRoute({ children, allowedRoles }) {
    const { user, authLoading } = useAuth();
    const location = useLocation();

    if (authLoading) {
        return (
            <div className="auth-page-shell">
                <p className="auth-loading-text">Checking session...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <Navigate
                to="/"
                replace
                state={{
                    loginRequired: true,
                    requestedPath: location.pathname,
                }}
            />
        );
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default RoleProtectedRoute;
