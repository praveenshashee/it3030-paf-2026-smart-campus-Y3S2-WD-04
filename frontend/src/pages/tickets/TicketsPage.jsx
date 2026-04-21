import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AppNavbar from '../../components/AppNavbar';
import PageTransition from '../../components/PageTransition';
import { getAllTickets, updateTicketStatus } from '../../services/ticketService';
import { useAuth } from '../../context/AuthContext';

function TicketsPage() {
    const { user } = useAuth();

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedPriority, setSelectedPriority] = useState('');

    const [ticketActionModal, setTicketActionModal] = useState({
        open: false,
        ticket: null,
        action: '',
        assignedTechnicianName: '',
        resolutionNotes: '',
        rejectionReason: '',
    });

    const canManageTickets = user?.role === 'ADMIN' || user?.role === 'TECHNICIAN';

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const response = await getAllTickets();
            setTickets(response.data);
            setError('');
        } catch (err) {
            setError('Failed to load tickets from the backend.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openTicketActionModal = (ticket, action) => {
        setTicketActionModal({
            open: true,
            ticket,
            action,
            assignedTechnicianName: ticket.assignedTechnicianName || '',
            resolutionNotes: '',
            rejectionReason: '',
        });
    };

    const closeTicketActionModal = () => {
        setTicketActionModal({
            open: false,
            ticket: null,
            action: '',
            assignedTechnicianName: '',
            resolutionNotes: '',
            rejectionReason: '',
        });
    };

    const handleStatusUpdate = async () => {
        const {
            ticket,
            action,
            assignedTechnicianName,
            resolutionNotes,
            rejectionReason,
        } = ticketActionModal;

        if (!ticket) {
            return;
        }

        const actionToStatusMap = {
            start: 'IN_PROGRESS',
            resolve: 'RESOLVED',
            close: 'CLOSED',
            reject: 'REJECTED',
        };

        const status = actionToStatusMap[action];

        if (action === 'reject' && !rejectionReason.trim()) {
            setError('Please enter a rejection reason before continuing.');
            return;
        }

        try {
            await updateTicketStatus(ticket.id, {
                status,
                assignedTechnicianName,
                resolutionNotes,
                rejectionReason,
            });

            setSuccessMessage(`Ticket updated to ${status}.`);
            setError('');
            closeTicketActionModal();
            fetchTickets();
        } catch (err) {
            setSuccessMessage('');
            setError('Failed to update ticket status.');
            console.error(err);
        }
    };

    const getStatusClass = (status) => {
        if (status === 'RESOLVED' || status === 'CLOSED') {
            return 'status-badge status-active';
        }

        if (status === 'REJECTED') {
            return 'status-badge status-out';
        }

        return 'status-badge';
    };

    const canStart = (status) => status === 'OPEN';
    const canResolve = (status) => status === 'IN_PROGRESS';
    const canClose = (status) => status === 'RESOLVED';
    const canReject = (status) => status === 'OPEN' || status === 'IN_PROGRESS';

    const totalTickets = tickets.length;
    const openOrInProgressTickets = tickets.filter(
        (ticket) => ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS'
    ).length;
    const resolvedOrClosedTickets = tickets.filter(
        (ticket) => ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'
    ).length;

    const filteredTickets = useMemo(() => {
        return tickets.filter((ticket) => {
            const matchesSearch =
                ticket.locationText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ticket.category.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus =
                selectedStatus === '' || ticket.status === selectedStatus;

            const matchesPriority =
                selectedPriority === '' || ticket.priority === selectedPriority;

            return matchesSearch && matchesStatus && matchesPriority;
        });
    }, [tickets, searchTerm, selectedStatus, selectedPriority]);

    const isStartAction = ticketActionModal.action === 'start';
    const isResolveAction = ticketActionModal.action === 'resolve';
    const isCloseAction = ticketActionModal.action === 'close';
    const isRejectAction = ticketActionModal.action === 'reject';

    return (
        <PageTransition>
            <>
                <AppNavbar />

                <div className="page-shell">
                    <div className="page-header">
                        <h1>Tickets</h1>
                        <p>Manage maintenance and incident reports.</p>
                    </div>

                    <div className="summary-grid">
                        <div className="glass-card summary-card">
                            <span className="summary-label">Total Tickets</span>
                            <strong className="summary-value">{totalTickets}</strong>
                        </div>

                        <div className="glass-card summary-card">
                            <span className="summary-label">Open / In Progress</span>
                            <strong className="summary-value">{openOrInProgressTickets}</strong>
                        </div>

                        <div className="glass-card summary-card">
                            <span className="summary-label">Resolved / Closed</span>
                            <strong className="summary-value">{resolvedOrClosedTickets}</strong>
                        </div>
                    </div>

                    <div className="glass-card filter-toolbar">
                        <div className="filter-toolbar-grid tickets-toolbar-grid">
                            <div className="filter-field filter-field-search">
                                <label className="form-label compact-label">Search</label>
                                <input
                                    type="text"
                                    className="form-control compact-control"
                                    placeholder="Search by location or category"
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                />
                            </div>

                            <div className="filter-field">
                                <label className="form-label compact-label">Status</label>
                                <select
                                    className="form-select compact-control"
                                    value={selectedStatus}
                                    onChange={(event) => setSelectedStatus(event.target.value)}
                                >
                                    <option value="">All Statuses</option>
                                    <option value="OPEN">Open</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="RESOLVED">Resolved</option>
                                    <option value="CLOSED">Closed</option>
                                    <option value="REJECTED">Rejected</option>
                                </select>
                            </div>

                            <div className="filter-field">
                                <label className="form-label compact-label">Priority</label>
                                <select
                                    className="form-select compact-control"
                                    value={selectedPriority}
                                    onChange={(event) => setSelectedPriority(event.target.value)}
                                >
                                    <option value="">All Priorities</option>
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                </select>
                            </div>

                            <div className="filter-action">
                                <Link to="/tickets/create" className="btn btn-primary link-btn w-100">
                                    Create Ticket
                                </Link>
                            </div>
                        </div>
                    </div>

                    {successMessage && (
                        <div className="alert alert-success">{successMessage}</div>
                    )}

                    {loading && <p>Loading tickets...</p>}
                    {error && <div className="alert alert-danger">{error}</div>}

                    {!loading && !error && (
                        <div className="glass-card table-card">
                            <div className="table-responsive">
                                <table className="table custom-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Resource</th>
                                            <th>Location</th>
                                            <th>Category</th>
                                            <th>Priority</th>
                                            <th>Status</th>
                                            <th>Technician</th>
                                            <th>Resolution / Rejection</th>
                                            {canManageTickets && (
                                                <th style={{ width: '220px' }}>Actions</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTickets.length > 0 ? (
                                            filteredTickets.map((ticket) => (
                                                <tr key={ticket.id}>
                                                    <td>{ticket.id}</td>
                                                    <td>{ticket.resourceName || '-'}</td>
                                                    <td>{ticket.locationText}</td>
                                                    <td>{ticket.category}</td>
                                                    <td>{ticket.priority}</td>
                                                    <td>
                                                        <span className={getStatusClass(ticket.status)}>
                                                            {ticket.status}
                                                        </span>
                                                    </td>
                                                    <td>{ticket.assignedTechnicianName || '-'}</td>
                                                    <td>{ticket.resolutionNotes || ticket.rejectionReason || '-'}</td>
                                                    {canManageTickets && (
                                                        <td>
                                                            <div className="action-group ticket-action-group">
                                                                {canStart(ticket.status) && (
                                                                    <button
                                                                        className="btn btn-info btn-sm"
                                                                        onClick={() => openTicketActionModal(ticket, 'start')}
                                                                    >
                                                                        Start
                                                                    </button>
                                                                )}

                                                                {canResolve(ticket.status) && (
                                                                    <button
                                                                        className="btn btn-success btn-sm"
                                                                        onClick={() => openTicketActionModal(ticket, 'resolve')}
                                                                    >
                                                                        Resolve
                                                                    </button>
                                                                )}

                                                                {canClose(ticket.status) && (
                                                                    <button
                                                                        className="btn btn-secondary btn-sm"
                                                                        onClick={() => openTicketActionModal(ticket, 'close')}
                                                                    >
                                                                        Close
                                                                    </button>
                                                                )}

                                                                {canReject(ticket.status) && (
                                                                    <button
                                                                        className="btn btn-danger btn-sm"
                                                                        onClick={() => openTicketActionModal(ticket, 'reject')}
                                                                    >
                                                                        Reject
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={canManageTickets ? 9 : 8}>
                                                    <div className="empty-state-card">
                                                        <h3 className="empty-state-title">No tickets found</h3>
                                                        <p className="empty-state-text">
                                                            No tickets match the current search or filter settings.
                                                        </p>
                                                        <div className="empty-state-actions">
                                                            <Link to="/tickets/create" className="btn btn-primary link-btn">
                                                                Create Ticket
                                                            </Link>
                                                        </div>
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

                {ticketActionModal.open && (
                    <div className="custom-modal-overlay">
                        <div className="glass-card custom-modal-card">
                            <h3 className="custom-modal-title">
                                {isStartAction && 'Start Ticket'}
                                {isResolveAction && 'Resolve Ticket'}
                                {isCloseAction && 'Close Ticket'}
                                {isRejectAction && 'Reject Ticket'}
                            </h3>

                            <p className="custom-modal-text">
                                {isStartAction && 'You can optionally assign a technician before starting this ticket.'}
                                {isResolveAction && 'Add optional resolution notes before marking this ticket as resolved.'}
                                {isCloseAction && 'Add optional closing notes before closing this ticket.'}
                                {isRejectAction && 'Please provide a rejection reason before rejecting this ticket.'}
                            </p>

                            {isStartAction && (
                                <input
                                    type="text"
                                    className="form-control modal-input"
                                    placeholder="Enter technician name (optional)"
                                    value={ticketActionModal.assignedTechnicianName}
                                    onChange={(event) =>
                                        setTicketActionModal((previous) => ({
                                            ...previous,
                                            assignedTechnicianName: event.target.value,
                                        }))
                                    }
                                />
                            )}

                            {(isResolveAction || isCloseAction) && (
                                <textarea
                                    className="form-control modal-textarea"
                                    rows="4"
                                    placeholder="Enter resolution notes (optional)"
                                    value={ticketActionModal.resolutionNotes}
                                    onChange={(event) =>
                                        setTicketActionModal((previous) => ({
                                            ...previous,
                                            resolutionNotes: event.target.value,
                                        }))
                                    }
                                />
                            )}

                            {isRejectAction && (
                                <textarea
                                    className="form-control modal-textarea"
                                    rows="4"
                                    placeholder="Enter rejection reason"
                                    value={ticketActionModal.rejectionReason}
                                    onChange={(event) =>
                                        setTicketActionModal((previous) => ({
                                            ...previous,
                                            rejectionReason: event.target.value,
                                        }))
                                    }
                                />
                            )}

                            <div className="custom-modal-actions">
                                <button
                                    className="btn btn-secondary"
                                    onClick={closeTicketActionModal}
                                >
                                    Cancel
                                </button>

                                <button
                                    className={`btn ${isRejectAction
                                        ? 'btn-danger'
                                        : isResolveAction
                                            ? 'btn-success'
                                            : isCloseAction
                                                ? 'btn-secondary'
                                                : 'btn-info'
                                        }`}
                                    onClick={handleStatusUpdate}
                                >
                                    {isStartAction && 'Start Ticket'}
                                    {isResolveAction && 'Resolve Ticket'}
                                    {isCloseAction && 'Close Ticket'}
                                    {isRejectAction && 'Reject Ticket'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        </PageTransition>
    );
}

export default TicketsPage;
