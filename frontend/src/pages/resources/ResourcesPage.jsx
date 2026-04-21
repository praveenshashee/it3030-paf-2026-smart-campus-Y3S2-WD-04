import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AppNavbar from '../../components/AppNavbar';
import PageTransition from '../../components/PageTransition';
import { deleteResource, getAllResources } from '../../services/resourceService';
import { useAuth } from '../../context/AuthContext';

function ResourcesPage() {
    const { user } = useAuth();

    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const [resourceToDelete, setResourceToDelete] = useState(null);

    const isAdmin = user?.role === 'ADMIN';

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

    const openDeleteModal = (resource) => {
        setResourceToDelete(resource);
    };

    const closeDeleteModal = () => {
        setResourceToDelete(null);
    };

    const handleDeleteConfirmed = async () => {
        if (!resourceToDelete) {
            return;
        }

        try {
            await deleteResource(resourceToDelete.id);
            setSuccessMessage('Resource deleted successfully.');
            setError('');
            closeDeleteModal();
            fetchResources();
        } catch (err) {
            setSuccessMessage('');
            setError('Failed to delete resource.');
            console.error(err);
        }
    };

    const getStatusClass = (status) => {
        return status === 'ACTIVE'
            ? 'status-badge status-active'
            : 'status-badge status-out';
    };

    const totalResources = resources.length;
    const activeResources = resources.filter(
        (resource) => resource.status === 'ACTIVE'
    ).length;
    const outOfServiceResources = resources.filter(
        (resource) => resource.status === 'OUT_OF_SERVICE'
    ).length;

    const filteredResources = useMemo(() => {
        return resources.filter((resource) => {
            const matchesSearch =
                resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.location.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesType =
                selectedType === '' || resource.type === selectedType;

            const matchesStatus =
                selectedStatus === '' || resource.status === selectedStatus;

            return matchesSearch && matchesType && matchesStatus;
        });
    }, [resources, searchTerm, selectedType, selectedStatus]);

    return (
        <PageTransition>
            <>
                <AppNavbar />

                <div className="page-shell">
                    <div className="page-header">
                        <h1>Resources</h1>
                        <p>Manage campus facilities and assets in one place.</p>
                    </div>

                    <div className="summary-grid">
                        <div className="glass-card summary-card">
                            <span className="summary-label">Total Resources</span>
                            <strong className="summary-value">{totalResources}</strong>
                        </div>

                        <div className="glass-card summary-card">
                            <span className="summary-label">Active Resources</span>
                            <strong className="summary-value">{activeResources}</strong>
                        </div>

                        <div className="glass-card summary-card">
                            <span className="summary-label">Out of Service</span>
                            <strong className="summary-value">{outOfServiceResources}</strong>
                        </div>
                    </div>

                    <div className="glass-card filter-toolbar">
                        <div className={`filter-toolbar-grid ${!isAdmin ? 'filter-toolbar-grid-no-action' : ''}`}>
                            <div className="filter-field filter-field-search">
                                <label className="form-label compact-label">Search</label>
                                <input
                                    type="text"
                                    className="form-control compact-control"
                                    placeholder="Search by name or location"
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                />
                            </div>

                            <div className="filter-field">
                                <label className="form-label compact-label">Type</label>
                                <select
                                    className="form-select compact-control"
                                    value={selectedType}
                                    onChange={(event) => setSelectedType(event.target.value)}
                                >
                                    <option value="">All Types</option>
                                    <option value="LECTURE_HALL">Lecture Hall</option>
                                    <option value="LAB">Lab</option>
                                    <option value="MEETING_ROOM">Meeting Room</option>
                                    <option value="EQUIPMENT">Equipment</option>
                                </select>
                            </div>

                            <div className="filter-field">
                                <label className="form-label compact-label">Status</label>
                                <select
                                    className="form-select compact-control"
                                    value={selectedStatus}
                                    onChange={(event) => setSelectedStatus(event.target.value)}
                                >
                                    <option value="">All Statuses</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="OUT_OF_SERVICE">Out of Service</option>
                                </select>
                            </div>

                            {isAdmin && (
                                <div className="filter-action">
                                    <Link to="/resources/create" className="btn btn-primary link-btn w-100">
                                        Create Resource
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {successMessage && (
                        <div className="alert alert-success">{successMessage}</div>
                    )}

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
                                            {isAdmin && (
                                                <th style={{ width: '180px' }}>Actions</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredResources.length > 0 ? (
                                            filteredResources.map((resource) => (
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
                                                    {isAdmin && (
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
                                                                    onClick={() => openDeleteModal(resource)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={isAdmin ? 7 : 6}>
                                                    <div className="empty-state-card">
                                                        <h3 className="empty-state-title">No resources found</h3>
                                                        <p className="empty-state-text">
                                                            No resources match the current search or filter settings.
                                                        </p>
                                                        {isAdmin && (
                                                            <div className="empty-state-actions">
                                                                <Link to="/resources/create" className="btn btn-primary link-btn">
                                                                    Create Resource
                                                                </Link>
                                                            </div>
                                                        )}
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

                {resourceToDelete && (
                    <div className="custom-modal-overlay">
                        <div className="glass-card custom-modal-card">
                            <h3 className="custom-modal-title">Delete Resource</h3>

                            <p className="custom-modal-text">
                                Are you sure you want to delete
                                <strong> {resourceToDelete.name}</strong>?
                                This action cannot be undone.
                            </p>

                            <div className="custom-modal-actions">
                                <button
                                    className="btn btn-secondary"
                                    onClick={closeDeleteModal}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="btn btn-danger"
                                    onClick={handleDeleteConfirmed}
                                >
                                    Delete Resource
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        </PageTransition>
    );
}

export default ResourcesPage;
