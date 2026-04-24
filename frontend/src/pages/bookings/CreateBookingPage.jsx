import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppNavbar from '../../components/AppNavbar';
import PageTransition from '../../components/PageTransition';
import { createBooking } from '../../services/bookingService';
import { getAllResources } from '../../services/resourceService';
import { getApiErrorMessage } from '../../utils/apiError';
import { isEndTimeAfterStartTime } from '../../utils/timeValidation';

function CreateBookingPage() {
    const navigate = useNavigate();

    const [resources, setResources] = useState([]);
    const [loadingResources, setLoadingResources] = useState(true);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        resourceId: '',
        bookingDate: '',
        startTime: '',
        endTime: '',
        purpose: '',
        expectedAttendees: '',
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
            setError('Failed to load resources for booking.');
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

    const selectedResource = resources.find(
        (resource) => String(resource.id) === String(formData.resourceId)
    );

    const formatTime = (time) => {
        return time ? time.slice(0, 5) : '-';
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isEndTimeAfterStartTime(formData.startTime, formData.endTime)) {
            setError('Booking end time must be after the start time.');
            return;
        }

        if (
            selectedResource &&
            selectedResource.capacity &&
            Number(formData.expectedAttendees) > Number(selectedResource.capacity)
        ) {
            setError(`Expected attendees cannot exceed the resource capacity of ${selectedResource.capacity}.`);
            return;
        }

        try {
            await createBooking({
                resourceId: Number(formData.resourceId),
                bookingDate: formData.bookingDate,
                startTime: `${formData.startTime}:00`,
                endTime: `${formData.endTime}:00`,
                purpose: formData.purpose.trim(),
                expectedAttendees: Number(formData.expectedAttendees),
            });

            setError('');
            navigate('/bookings');
        } catch (err) {
            setError(
                getApiErrorMessage(
                    err,
                    'Failed to create booking. Check for overlapping times or invalid input.'
                )
            );
            console.error(err);
        }
    };

    return (
        <PageTransition>
            <>
                <AppNavbar />

                <div className="page-shell">
                    <div className="page-header">
                        <h1>Create Booking</h1>
                        <p>Submit a booking request for a campus resource.</p>
                    </div>

                    <div className="top-actions">
                        <Link to="/bookings" className="btn btn-secondary link-btn">
                            Back to Bookings
                        </Link>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="glass-card form-card">
                        <h2 className="section-title">Booking Details</h2>

                        {loadingResources ? (
                            <p>Loading resources...</p>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Resource</label>
                                        <select
                                            name="resourceId"
                                            className="form-select"
                                            value={formData.resourceId}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select a resource</option>
                                            {resources.map((resource) => (
                                                <option key={resource.id} value={resource.id}>
                                                    {resource.name} ({resource.type})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Booking Date</label>
                                        <input
                                            type="date"
                                            name="bookingDate"
                                            className="form-control"
                                            value={formData.bookingDate}
                                            onChange={handleChange}
                                            min={new Date().toISOString().slice(0, 10)}
                                            required
                                        />
                                    </div>

                                    {selectedResource && (
                                        <div className="col-12">
                                            <div className="alert alert-info mb-0">
                                                Available from {formatTime(selectedResource.availableFromTime)} to {formatTime(selectedResource.availableToTime)}
                                            </div>
                                        </div>
                                    )}

                                    <div className="col-md-6">
                                        <label className="form-label">Start Time</label>
                                        <input
                                            type="time"
                                            name="startTime"
                                            className="form-control"
                                            value={formData.startTime}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">End Time</label>
                                        <input
                                            type="time"
                                            name="endTime"
                                            className="form-control"
                                            value={formData.endTime}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Purpose</label>
                                        <input
                                            type="text"
                                            name="purpose"
                                            className="form-control"
                                            value={formData.purpose}
                                            onChange={handleChange}
                                            placeholder="Enter booking purpose"
                                            required
                                            maxLength="150"
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Expected Attendees</label>
                                        <input
                                            type="number"
                                            name="expectedAttendees"
                                            className="form-control"
                                            value={formData.expectedAttendees}
                                            onChange={handleChange}
                                            placeholder="Enter expected attendees"
                                            required
                                            min="1"
                                            step="1"
                                        />
                                    </div>

                                    <div className="col-12 action-group">
                                        <button type="submit" className="btn btn-primary">
                                            Create Booking
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

export default CreateBookingPage;
