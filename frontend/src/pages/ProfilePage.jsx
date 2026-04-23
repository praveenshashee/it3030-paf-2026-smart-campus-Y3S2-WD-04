import { Link } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import PageTransition from '../components/PageTransition';
import { useAuth } from '../context/AuthContext';

function ProfilePage() {
    const { user } = useAuth();

    const getInitials = (name) => {
        if (!name) return 'U';

        return name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0].toUpperCase())
            .join('');
    };

    const isDemoUser = user?.email?.includes('@smartcampus.local');

    return (
        <PageTransition>
            <>
                <AppNavbar />

                <div className="page-shell">
                    <div className="page-content-narrow">
                        <div className="page-header">
                            <h1>Profile</h1>
                            <p>View your account information and current access level.</p>
                        </div>

                        <div className="top-actions">
                            <Link to="/" className="btn btn-secondary link-btn">
                                Back to Home
                            </Link>
                        </div>

                        <div className="profile-hero">
                            <div className="profile-top">
                                <div className="profile-avatar-wrap">
                                    {user?.profileImageUrl ? (
                                        <img
                                            src={user.profileImageUrl}
                                            alt={user.fullName}
                                            className="profile-avatar-image"
                                        />
                                    ) : (
                                        <div className="profile-avatar-fallback">
                                            {getInitials(user?.fullName)}
                                        </div>
                                    )}
                                </div>

                                <div className="profile-identity">
                                    <h2 className="profile-name">{user?.fullName || 'Unknown User'}</h2>
                                    <p className="profile-email">{user?.email || '-'}</p>

                                    <div className="profile-badge-row">
                                        <span className="profile-role-badge">{user?.role || 'USER'}</span>
                                        <span className="profile-auth-badge">
                                            {isDemoUser ? 'Demo Session' : 'Google OAuth'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card profile-card">
                            <div className="profile-details-grid">
                                <div className="profile-detail-item">
                                    <span className="profile-detail-label">Full Name</span>
                                    <strong className="profile-detail-value">
                                        {user?.fullName || '-'}
                                    </strong>
                                </div>

                                <div className="profile-detail-item">
                                    <span className="profile-detail-label">Email Address</span>
                                    <strong className="profile-detail-value">
                                        {user?.email || '-'}
                                    </strong>
                                </div>

                                <div className="profile-detail-item">
                                    <span className="profile-detail-label">Role</span>
                                    <strong className="profile-detail-value">
                                        {user?.role || '-'}
                                    </strong>
                                </div>

                                <div className="profile-detail-item">
                                    <span className="profile-detail-label">Authentication Type</span>
                                    <strong className="profile-detail-value">
                                        {isDemoUser ? 'Temporary Development Login' : 'Google OAuth 2.0'}
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </PageTransition>
    );
}

export default ProfilePage;
