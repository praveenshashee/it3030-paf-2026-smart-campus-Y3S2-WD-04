import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import PageTransition from '../components/PageTransition';
import { getAllUsers, updateUserRole } from '../services/userService';

function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [roleChangeModal, setRoleChangeModal] = useState({
        open: false,
        userId: null,
        fullName: '',
        currentRole: '',
        newRole: '',
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await getAllUsers();
            setUsers(response.data);
            setError('');
        } catch (err) {
            setError('Failed to load users.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openRoleChangeModal = (user) => {
        setRoleChangeModal({
            open: true,
            userId: user.id,
            fullName: user.fullName || 'Unknown User',
            currentRole: user.role,
            newRole: user.role,
        });
    };

    const closeRoleChangeModal = () => {
        setRoleChangeModal({
            open: false,
            userId: null,
            fullName: '',
            currentRole: '',
            newRole: '',
        });
    };

    const confirmRoleChange = async () => {
        try {
            await updateUserRole(roleChangeModal.userId, roleChangeModal.newRole);
            setSuccessMessage('User role updated successfully.');
            setError('');
            closeRoleChangeModal();
            fetchUsers();
        } catch (err) {
            setSuccessMessage('');
            setError('Failed to update user role.');
            console.error(err);
        }
    };

    const getAuthType = (email) => {
        if (!email) return '-';
        return email.includes('@smartcampus.local')
            ? 'Demo Login'
            : 'Google OAuth';
    };

    return (
        <PageTransition>
            <>
                <AppNavbar />

                <div className="page-shell">
                    <div className="page-content-narrow">
                        <div className="page-header">
                            <h1>User Role Management</h1>
                            <p>Manage user access roles across the Smart Campus system.</p>
                        </div>

                        <div className="top-actions">
                            <Link to="/" className="btn btn-secondary link-btn">
                                Back to Home
                            </Link>
                        </div>

                        {successMessage && (
                            <div className="alert alert-success">{successMessage}</div>
                        )}

                        {loading && <p>Loading users...</p>}
                        {error && <div className="alert alert-danger">{error}</div>}

                        {!loading && !error && (
                            <div className="glass-card table-card">
                                <div className="table-responsive">
                                    <table className="table custom-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Full Name</th>
                                                <th>Email</th>
                                                <th>Auth Type</th>
                                                <th>Current Role</th>
                                                <th style={{ width: '220px' }}>Change Role</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.length > 0 ? (
                                                users.map((user) => (
                                                    <tr key={user.id}>
                                                        <td>{user.id}</td>
                                                        <td>{user.fullName || '-'}</td>
                                                        <td>{user.email || '-'}</td>
                                                        <td>{getAuthType(user.email)}</td>
                                                        <td>
                                                            <span className="status-badge status-active">
                                                                {user.role}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="btn btn-primary btn-sm w-100"
                                                                onClick={() => openRoleChangeModal(user)}
                                                            >
                                                                Change Role
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6">
                                                        <div className="empty-state-card">
                                                            <h3 className="empty-state-title">No users found</h3>
                                                            <p className="empty-state-text mb-0">
                                                                Users will appear here after login or demo access.
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {roleChangeModal.open && (
                    <div className="custom-modal-overlay">
                        <div className="glass-card custom-modal-card">
                            <h3 className="custom-modal-title">Confirm Role Change</h3>

                            <p className="custom-modal-text">
                                You are changing the role for
                                <strong> {roleChangeModal.fullName}</strong>.
                                Please confirm the new access level carefully.
                            </p>

                            <div className="mb-3">
                                <label className="form-label">New Role</label>
                                <select
                                    className="form-select"
                                    value={roleChangeModal.newRole}
                                    onChange={(event) =>
                                        setRoleChangeModal((previous) => ({
                                            ...previous,
                                            newRole: event.target.value,
                                        }))
                                    }
                                >
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="TECHNICIAN">TECHNICIAN</option>
                                </select>
                            </div>

                            <div className="custom-modal-actions">
                                <button
                                    className="btn btn-secondary"
                                    onClick={closeRoleChangeModal}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="btn btn-danger"
                                    onClick={confirmRoleChange}
                                >
                                    Confirm Change
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        </PageTransition>
    );
}

export default AdminUsersPage;