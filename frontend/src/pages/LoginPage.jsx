import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PageTransition from '../components/PageTransition';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
    const [slide, setSlide] = useState(0);

    const {
        user,
        authLoading,
        loginWithGoogle,
        loginAsDevUser,
        loginAsDevAdmin,
        loginAsDevTechnician,
    } = useAuth();

    const slides = [
        {
            title: 'Smart Campus Operations Hub',
            description: 'Manage campus resources, approvals, maintenance work, and alerts from one connected system.',
        },
        {
            title: 'Book Facilities & Assets',
            description: 'Reserve lecture halls, labs, meeting rooms, and equipment with workflow-aware approvals.',
        },
        {
            title: 'Track Incidents Clearly',
            description: 'Report issues, assign technicians, follow progress, and keep every update visible.',
        },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setSlide((currentSlide) => (currentSlide + 1) % slides.length);
        }, 4200);

        return () => clearInterval(timer);
    }, [slides.length]);

    if (authLoading) {
        return <p className="auth-loading-text">Checking session...</p>;
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    return (
        <PageTransition>
            <div className="auth-page-shell">
                <div className="auth-card">
                    <section className="auth-visual-panel">
                        <div className="auth-visual-grid" />

                        <div className="auth-campus-mark">
                            <span>SC</span>
                        </div>

                        <div className="auth-feature-row">
                            <div className="auth-feature-pill">
                                <strong>Book</strong>
                                <span>Facilities</span>
                            </div>
                            <div className="auth-feature-pill">
                                <strong>Track</strong>
                                <span>Tickets</span>
                            </div>
                            <div className="auth-feature-pill">
                                <strong>Notify</strong>
                                <span>Teams</span>
                            </div>
                        </div>

                        <div className="auth-slide-panel" key={slide}>
                            <h2>{slides[slide].title}</h2>
                            <p>{slides[slide].description}</p>

                            <div className="auth-slide-dots">
                                {slides.map((item, index) => (
                                    <button
                                        key={item.title}
                                        type="button"
                                        className={`auth-slide-dot ${index === slide ? 'active' : ''}`}
                                        aria-label={`Show ${item.title}`}
                                        onClick={() => setSlide(index)}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="auth-form-panel">
                        <div className="auth-brand-row">
                            <div className="auth-brand-icon">SC</div>
                            <div>
                                <strong>Smart Campus</strong>
                                <span>Operations Hub</span>
                            </div>
                        </div>

                        <span className="auth-eyebrow">OAuth 2.0 Login</span>
                        <h1 className="auth-title">Welcome Back</h1>

                        <p className="auth-subtitle">
                            Sign in to continue managing resources, bookings, tickets, and notifications.
                        </p>

                        <div className="auth-action-stack">
                            <button className="auth-login-btn auth-google-btn" onClick={loginWithGoogle}>
                                <span className="auth-google-icon" aria-hidden="true">G</span>
                                Continue with Google
                            </button>

                            <div className="auth-divider">
                                <span>Temporary development access</span>
                            </div>

                            <button className="auth-login-btn auth-demo-primary" onClick={loginAsDevAdmin}>
                                Sign in as Demo Admin
                            </button>

                            <button className="auth-login-btn auth-demo-secondary" onClick={loginAsDevUser}>
                                Sign in as Demo User
                            </button>

                            <button className="auth-login-btn auth-demo-secondary" onClick={loginAsDevTechnician}>
                                Sign in as Demo Technician
                            </button>
                        </div>

                        <div className="auth-note">
                            <strong>Role-aware access</strong>
                            <span>Admin, user, and technician sessions open different permissions and workflows.</span>
                        </div>
                    </section>
                </div>
            </div>
        </PageTransition>
    );
}

export default LoginPage;
