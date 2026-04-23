import { Navigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
    const {
        user,
        authLoading,
        loginWithGoogle,
        loginAsDevUser,
        loginAsDevAdmin,
        loginAsDevTechnician,
    } = useAuth();

    if (authLoading) {
        return <p className="auth-loading-text">Checking session...</p>;
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <PageTransition>
            <div className="auth-page-shell">
                <div className="glass-card auth-card">
                    <span className="landing-badge">OAuth 2.0 Login</span>

                    <h1 className="auth-title">Sign in to Smart Campus Hub</h1>

                    <p className="auth-subtitle">
                        Continue with your Google account or use temporary demo roles for development testing.
                    </p>

                    <div className="auth-action-stack">
                        <button className="btn btn-primary auth-google-btn" onClick={loginWithGoogle}>
                            Continue with Google
                        </button>

                        <div className="auth-divider">Temporary development access</div>

                        <button className="btn btn-secondary" onClick={loginAsDevUser}>
                            Sign in as Demo User
                        </button>

                        <button className="btn btn-secondary" onClick={loginAsDevAdmin}>
                            Sign in as Demo Admin
                        </button>

                        <button className="btn btn-secondary" onClick={loginAsDevTechnician}>
                            Sign in as Demo Technician
                        </button>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}

export default LoginPage;
