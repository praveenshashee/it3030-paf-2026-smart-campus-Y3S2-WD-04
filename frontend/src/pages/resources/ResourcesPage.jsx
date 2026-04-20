import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteResource, getAllResources } from '../../services/resourceService';

function ResourcesPage() {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const response = await getAllResources();
            setResources(response.data);
            setError('');
        } catch (err) {
            setError('Failed to load resources from the backend.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this resource?'
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteResource(id);
            setSuccessMessage('Resource deleted successfully.');
            setError('');
            fetchResources();
        } catch (err) {
            setSuccessMessage('');
            setError('Failed to delete resource.');
            console.error(err);
        }
    };

    const getStatusClass = (status) => {
        return status === 'ACTIVE' ? 'status-badge status-active' : 'status-badge status-out';
    };

    return (
        <div className="page-shell">
            <div className="page-header">
                <h1>Resources</h1>
                <p>Manage campus facilities and assets in one place.</p>
            </div>

            <div className="top-actions">
                <Link to="/resources/create" className="btn btn-primary link-btn">
                    Create Resource
                </Link>
            </div>

            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {loading && <p>Loading resources...</p>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && !error && (
                <div className="glass-card table-card">
                    <div className="table-responsive">
                        <table className="table custom-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Capacity</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th style={{ width: '180px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resources.length > 0 ? (
                                    resources.map((resource) => (
                                        <tr key={resource.id}>
                                            <td>{resource.id}</td>
                                            <td>{resource.name}</td>
                                            <td>{resource.type}</td>
                                            <td>{resource.capacity}</td>
                                            <td>{resource.location}</td>
                                            <td>
                                                <span className={getStatusClass(resource.status)}>
                                                    {resource.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-group">
                                                    <Link
                                                        to={`/resources/edit/${resource.id}`}
                                                        className="btn btn-warning btn-sm link-btn"
                                                    >
                                                        Edit
                                                    </Link>

                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleDelete(resource.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="empty-state">
                                            No resources found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ResourcesPage;