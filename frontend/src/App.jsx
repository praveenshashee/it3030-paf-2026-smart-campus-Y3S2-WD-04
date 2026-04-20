import { useEffect, useState } from 'react';
import { createResource, getAllResources } from './services/resourceService';

function App() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    type: 'LECTURE_HALL',
    capacity: '',
    location: '',
    status: 'ACTIVE',
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
      setError('Failed to load resources from the backend.');
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
      await createResource({
        ...formData,
        capacity: Number(formData.capacity),
      });

      setSuccessMessage('Resource created successfully.');
      setError('');

      // Reset the form after successful creation.
      setFormData({
        name: '',
        type: 'LECTURE_HALL',
        capacity: '',
        location: '',
        status: 'ACTIVE',
      });

      fetchResources();
    } catch (err) {
      setSuccessMessage('');
      setError('Failed to create resource.');
      console.error(err);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-3">Smart Campus Operations Hub</h1>
      <p className="text-muted">Resources Module</p>

      <div className="card mb-4">
        <div className="card-body">
          <h4 className="card-title mb-3">Create Resource</h4>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Resource Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter resource name"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Type</label>
                <select
                  name="type"
                  className="form-select"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="LECTURE_HALL">Lecture Hall</option>
                  <option value="LAB">Lab</option>
                  <option value="MEETING_ROOM">Meeting Room</option>
                  <option value="EQUIPMENT">Equipment</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  className="form-control"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="Enter capacity"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter location"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="OUT_OF_SERVICE">Out of Service</option>
                </select>
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-primary">
                  Create Resource
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {loading && <p>Loading resources...</p>}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Location</th>
                <th>Status</th>
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
                    <td>{resource.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No resources found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;