import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppNavbar from '../../components/AppNavbar';
import PageTransition from '../../components/PageTransition';
import { getAllResources } from '../../services/resourceService';
import { createTicket } from '../../services/ticketService';
import { getApiErrorMessage } from '../../utils/apiError';

function CreateTicketPage() {
    const navigate = useNavigate();

    const [resources, setResources] = useState([]);
    const [loadingResources, setLoadingResources] = useState(true);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        resourceId: '',
        locationText: '',
        category: '',
        description: '',
        priority: 'MEDIUM',
        preferredContact: '',
    });

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const response = await getAllResources();
            setResources(response.data);
            setError('');
        } catch (err) {
            setError('Failed to load resources for ticket creation.');
            console.error(err);
        } finally {
            setLoadingResources(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await createTicket({
                resourceId: formData.resourceId ? Number(formData.resourceId) : null,
                locationText: formData.locationText.trim(),
                category: formData.category.trim(),
                description: formData.description.trim(),
                priority: formData.priority,
                preferredContact: formData.preferredContact.trim(),
            });

            setError('');
            navigate('/tickets');
        } catch (err) {
            setError(getApiErrorMessage(err, 'Failed to create ticket.'));
            console.error(err);
        }
    };

    return (
        <PageTransition>
            <>
                <AppNavbar />

                <div className="page-shell">
                    <div className="page-header">
                        <h1>Create Ticket</h1>
                        <p>Report a maintenance or incident issue.</p>
                    </div>

                    <div className="top-actions">
                        <Link to="/tickets" className="btn btn-secondary link-btn">
                            Back to Tickets
                        </Link>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="glass-card form-card">
                        <h2 className="section-title">Ticket Details</h2>

                        {loadingResources ? (
                            <p>Loading resources...</p>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Linked Resource (Optional)</label>
                                        <select
                                            name="resourceId"
                                            className="form-select"
                                            value={formData.resourceId}
                                            onChange={handleChange}
                                        >
                                            <option value="">No linked resource</option>
                                            {resources.map((resource) => (
                                                <option key={resource.id} value={resource.id}>
                                                    {resource.name} ({resource.type})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Location</label>
                                        <input
                                            type="text"
                                            name="locationText"
                                            className="form-control"
                                            value={formData.locationText}
                                            onChange={handleChange}
                                            placeholder="Enter location"
                                            required
                                            maxLength="120"
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Category</label>
                                        <input
                                            type="text"
                                            name="category"
                                            className="form-control"
                                            value={formData.category}
                                            onChange={handleChange}
                                            placeholder="Enter issue category"
                                            required
                                            maxLength="60"
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Priority</label>
                                        <select
                                            name="priority"
                                            className="form-select"
                                            value={formData.priority}
                                            onChange={handleChange}
                                        >
                                            <option value="LOW">Low</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="HIGH">High</option>
                                        </select>
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            name="description"
                                            className="form-control"
                                            rows="4"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Describe the issue clearly"
                                            required
                                            maxLength="500"
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Preferred Contact</label>
                                        <input
                                            type="text"
                                            name="preferredContact"
                                            className="form-control"
                                            value={formData.preferredContact}
                                            onChange={handleChange}
                                            placeholder="Enter contact number or email"
                                            required
                                        />
                                    </div>

                                    <div className="col-12 action-group">
                                        <button type="submit" className="btn btn-primary">
                                            Create Ticket
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </>
        </PageTransition>
    );
}

export default CreateTicketPage;
