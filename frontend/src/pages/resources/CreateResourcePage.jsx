import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ResourceForm from '../../components/resources/ResourceForm';
import { createResource } from '../../services/resourceService';
import AppNavbar from '../../components/AppNavbar';
import PageTransition from '../../components/PageTransition';
import { getApiErrorMessage } from '../../utils/apiError';
import { isEndTimeAfterStartTime } from '../../utils/timeValidation';

function CreateResourcePage() {
    const navigate = useNavigate();

    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        type: 'LECTURE_HALL',
        capacity: '',
        location: '',
        availableFromTime: '08:00',
        availableToTime: '18:00',
        status: 'ACTIVE',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isEndTimeAfterStartTime(formData.availableFromTime, formData.availableToTime)) {
            setError('Resource available-to time must be after available-from time.');
            return;
        }

        try {
            await createResource({
                ...formData,
                name: formData.name.trim(),
                capacity: Number(formData.capacity),
                location: formData.location.trim(),
            });

            setError('');
            navigate('/resources');
        } catch (err) {
            setError(getApiErrorMessage(err, 'Failed to create resource.'));
            console.error(err);
        }
    };

    return (
        <PageTransition>
            <>
                <AppNavbar />
                <div className="page-shell">
                    <div className="page-content-narrow">
                        <div className="page-header">
                            <h1>Create Resource</h1>
                            <p>Add a new facility or asset to the system.</p>
                        </div>

                        <div className="top-actions">
                            <Link to="/resources" className="btn btn-secondary link-btn">
                                Back to Resources
                            </Link>
                        </div>

                        {error && <div className="alert alert-danger">{error}</div>}

                        <ResourceForm
                            formData={formData}
                            onChange={handleChange}
                            onSubmit={handleSubmit}
                            submitLabel="Create Resource"
                        />
                    </div>
                </div>
            </>
        </PageTransition>
    );
}

export default CreateResourcePage;
