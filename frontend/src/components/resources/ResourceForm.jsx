function ResourceForm({
    formData,
    onChange,
    onSubmit,
    submitLabel,
    cancelLabel,
    onCancel,
}) {
    return (
        <div className="glass-card form-card">
            <h2 className="section-title">{submitLabel}</h2>

            <form onSubmit={onSubmit}>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Resource Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={formData.name}
                            onChange={onChange}
                            placeholder="Enter resource name"
                            required
                            maxLength="80"
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Type</label>
                        <select
                            name="type"
                            className="form-select"
                            value={formData.type}
                            onChange={onChange}
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
                            onChange={onChange}
                            placeholder="Enter capacity"
                            required
                            min="1"
                            step="1"
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Location</label>
                        <input
                            type="text"
                            name="location"
                            className="form-control"
                            value={formData.location}
                            onChange={onChange}
                            placeholder="Enter location"
                            required
                            maxLength="120"
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Status</label>
                        <select
                            name="status"
                            className="form-select"
                            value={formData.status}
                            onChange={onChange}
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="OUT_OF_SERVICE">Out of Service</option>
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Available From</label>
                        <input
                            type="time"
                            name="availableFromTime"
                            className="form-control"
                            value={formData.availableFromTime}
                            onChange={onChange}
                            required
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Available To</label>
                        <input
                            type="time"
                            name="availableToTime"
                            className="form-control"
                            value={formData.availableToTime}
                            onChange={onChange}
                            required
                        />
                    </div>

                    <div className="col-12 action-group">
                        <button type="submit" className="btn btn-primary">
                            {submitLabel}
                        </button>

                        {onCancel && (
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onCancel}
                            >
                                {cancelLabel || 'Cancel'}
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}

export default ResourceForm;
