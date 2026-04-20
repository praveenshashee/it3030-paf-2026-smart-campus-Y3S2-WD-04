import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ResourceForm from '../../components/resources/ResourceForm';
import { getResourceById, updateResource } from '../../services/resourceService';
import AppNavbar from '../../components/AppNavbar';
import PageTransition from '../../components/PageTransition';

function EditResourcePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        type: 'LECTURE_HALL',
        capacity: '',
        location: '',
        status: 'ACTIVE',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchResource();
    }, []);

    const fetchResource = async () => {
        try {
            const response = await getResourceById(id);
            const resource = response.data;

            setFormData({
                name: resource.name,
                type: resource.type,
                capacity: resource.capacity,
                location: resource.location,
                status: resource.status,
            });

            setError('');
        } catch (err) {
            setError('Failed to load resource details.');
            console.error(err);
        } finally {
            setLoading(false);
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
            await updateResource(id, {
                ...formData,
                capacity: Number(formData.capacity),
            });

            setError('');
            navigate('/resources');
        } catch (err) {
            setError('Failed to update resource.');
            console.error(err);
        }
    };

    return (
        <PageTransition>
            <>
                <AppNavbar />
                <div className="page-shell">
                    <div className="page-header">
                        <h1>Edit Resource</h1>
                        <p>Update the selected facility or asset details.</p>
                    </div>

                    <div className="top-actions">
                        <Link to="/resources" className="btn btn-secondary link-btn">
                            Back to Resources
                        </Link>
                    </div>

                    {loading && <p>Loading resource details...</p>}
                    {error && <div className="alert alert-danger">{error}</div>}

                    {!loading && !error && (
                        <ResourceForm
                            formData={formData}
                            onChange={handleChange}
                            onSubmit={handleSubmit}
                            submitLabel="Update Resource"
                            cancelLabel="Cancel"
                            onCancel={() => navigate('/resources')}
                        />
                    )}
                </div>
            </>
        </PageTransition>
    );
}

export default EditResourcePage;