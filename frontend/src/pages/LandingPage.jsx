import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

function LandingPage() {
    return (
        <PageTransition>
            <div className="landing-page-shell">
                <div className="landing-navbar-shell">
                    <div className="page-shell landing-navbar">
                        <Link to="/" className="landing-brand">
                            Smart Campus Hub
                        </Link>

                        <div className="landing-nav-links">
                            <Link to="/resources" className="landing-nav-link">
                                Resources
                            </Link>
                            <Link to="/bookings" className="landing-nav-link">
                                Bookings
                            </Link>
                            <Link to="/tickets" className="landing-nav-link">
                                Tickets
                            </Link>
                            <Link to="/notifications" className="landing-nav-link">
                                Notifications
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="page-shell">
                    <section className="landing-hero" id="overview">
                        <div className="landing-hero-content">
                            <span className="landing-badge">Smart Campus Platform</span>

                            <h1>
                                Manage campus resources, bookings, and operations in one
                                <span className="landing-highlight"> modern system</span>
                            </h1>

                            <p className="landing-subtitle">
                                Smart Campus Operations Hub helps universities manage facilities,
                                assets, bookings, maintenance workflows, and notifications
                                through a structured and user-friendly web platform.
                            </p>

                            <div className="landing-action-row">
                                <Link to="/resources" className="btn btn-primary link-btn">
                                    Explore Resources
                                </Link>
                            </div>

                            <div className="landing-stats-row">
                                <div className="landing-stat-card">
                                    <strong>Resources</strong>
                                    <span>Manage rooms, labs, and equipment</span>
                                </div>

                                <div className="landing-stat-card">
                                    <strong>Bookings</strong>
                                    <span>Support request and approval workflows</span>
                                </div>

                                <div className="landing-stat-card">
                                    <strong>Operations</strong>
                                    <span>Track tickets and notifications</span>
                                </div>
                            </div>
                        </div>

                        <div className="landing-hero-visual glass-card">
                            <div className="landing-visual-chip">Campus Operations</div>
                            <h3>Built for smoother university workflows</h3>
                            <p>
                                From facilities and assets to booking approvals, maintenance
                                tickets, and notifications — this system is designed to keep
                                campus operations organized and easier to manage.
                            </p>

                            <div className="landing-mini-grid">
                                <div className="landing-mini-card">
                                    <strong>Resources</strong>
                                    <span>Rooms, labs, assets</span>
                                </div>

                                <div className="landing-mini-card">
                                    <strong>Bookings</strong>
                                    <span>Requests and approvals</span>
                                </div>

                                <div className="landing-mini-card">
                                    <strong>Tickets</strong>
                                    <span>Maintenance workflow</span>
                                </div>

                                <div className="landing-mini-card">
                                    <strong>Alerts</strong>
                                    <span>Activity and updates</span>
                                </div>
                            </div>

                            <div className="landing-floating-note landing-note-one">
                                Live resource management
                            </div>

                            <div className="landing-floating-note landing-note-two">
                                Structured workflows
                            </div>
                        </div>
                    </section>

                    <section className="feature-strip" id="modules">
                        <div className="glass-card feature-card module-link-card">
                            <div>
                                <h3>Facilities & Assets</h3>
                                <p>
                                    Manage lecture halls, labs, meeting rooms, and equipment with
                                    clear metadata and availability status.
                                </p>
                            </div>

                            <Link to="/resources" className="btn btn-sm btn-primary link-btn">
                                Open
                            </Link>
                        </div>

                        <div className="glass-card feature-card module-link-card">
                            <div>
                                <h3>Booking Workflows</h3>
                                <p>
                                    Support booking requests, approval flows, and conflict-aware
                                    scheduling for campus resources.
                                </p>
                            </div>

                            <Link to="/bookings" className="btn btn-sm btn-primary link-btn">
                                Open
                            </Link>
                        </div>

                        <div className="glass-card feature-card module-link-card">
                            <div>
                                <h3>Maintenance & Tickets</h3>
                                <p>
                                    Handle issue reporting, technician progress, resolution notes,
                                    and operational follow-up.
                                </p>
                            </div>

                            <Link to="/tickets" className="btn btn-sm btn-primary link-btn">
                                Open
                            </Link>
                        </div>
                    </section>

                    <section className="module-preview-section">
                        <div className="glass-card module-preview-card">
                            <div>
                                <h2 className="section-title mb-2">System activity is now connected</h2>
                                <p className="module-preview-text">
                                    Resources, bookings, tickets, and notifications are already
                                    integrated into a single workflow-driven system foundation.
                                </p>
                            </div>

                            <div className="module-preview-actions">
                                <Link to="/notifications" className="btn btn-primary link-btn">
                                    View Notifications
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>

                <footer className="landing-footer">
                    <div className="page-shell landing-footer-content">
                        <div className="landing-footer-brand">
                            <h3>Smart Campus Hub</h3>
                            <p>
                                A modern university operations platform for resources, bookings,
                                tickets, and notifications.
                            </p>
                        </div>

                        <div className="landing-footer-links">
                            <Link to="/resources" className="landing-footer-link">
                                Resources
                            </Link>
                            <Link to="/bookings" className="landing-footer-link">
                                Bookings
                            </Link>
                            <Link to="/tickets" className="landing-footer-link">
                                Tickets
                            </Link>
                            <Link to="/notifications" className="landing-footer-link">
                                Notifications
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
        </PageTransition>
    );
}

export default LandingPage;