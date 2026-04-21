import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppNavbar from '../../components/AppNavbar';
import PageTransition from '../../components/PageTransition';
import { getAllTickets, updateTicketStatus } from '../../services/ticketService';

function TicketsPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

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

    const handleStatusUpdate = async (ticketId, status) => {
        let assignedTechnicianName = '';
        let resolutionNotes = '';
        let rejectionReason = '';

        if (status === 'IN_PROGRESS') {
            assignedTechnicianName =
                window.prompt('Enter technician name (optional):') || '';
        }

        if (status === 'RESOLVED' || status === 'CLOSED') {
            resolutionNotes =
                window.prompt('Enter resolution notes (optional):') || '';
        }

        if (status === 'REJECTED') {
            rejectionReason = window.prompt('Enter rejection reason:') || '';

            if (!rejectionReason.trim()) {
                return;
            }
        }

        try {
            await updateTicketStatus(ticketId, {
                status,
                assignedTechnicianName,
                resolutionNotes,
                rejectionReason,
            });

            setSuccessMessage(`Ticket updated to ${status}.`);
            setError('');
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

    // Quick summary values for the top cards.
    const totalTickets = tickets.length;
    const openOrInProgressTickets = tickets.filter(
        (ticket) => ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS'
    ).length;
    const resolvedOrClosedTickets = tickets.filter(
        (ticket) => ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'
    ).length;

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

                    <div className="top-actions">
                        <Link to="/tickets/create" className="btn btn-primary link-btn">
                            Create Ticket
                        </Link>
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
                                            <th style={{ width: '220px' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tickets.length > 0 ? (
                                            tickets.map((ticket) => (
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
                                                    <td>
                                                        <div className="action-group ticket-action-group">
                                                            {canStart(ticket.status) && (
                                                                <button
                                                                    className="btn btn-info btn-sm"
                                                                    onClick={() =>
                                                                        handleStatusUpdate(ticket.id, 'IN_PROGRESS')
                                                                    }
                                                                >
                                                                    Start
                                                                </button>
                                                            )}

                                                            {canResolve(ticket.status) && (
                                                                <button
                                                                    className="btn btn-success btn-sm"
                                                                    onClick={() =>
                                                                        handleStatusUpdate(ticket.id, 'RESOLVED')
                                                                    }
                                                                >
                                                                    Resolve
                                                                </button>
                                                            )}

                                                            {canClose(ticket.status) && (
                                                                <button
                                                                    className="btn btn-secondary btn-sm"
                                                                    onClick={() =>
                                                                        handleStatusUpdate(ticket.id, 'CLOSED')
                                                                    }
                                                                >
                                                                    Close
                                                                </button>
                                                            )}

                                                            {canReject(ticket.status) && (
                                                                <button
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() =>
                                                                        handleStatusUpdate(ticket.id, 'REJECTED')
                                                                    }
                                                                >
                                                                    Reject
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="9" className="empty-state">
                                                    No tickets found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </>
        </PageTransition>
    );
}

export default TicketsPage;