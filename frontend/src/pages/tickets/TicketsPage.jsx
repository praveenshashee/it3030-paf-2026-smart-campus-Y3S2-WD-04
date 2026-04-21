import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppNavbar from '../../components/AppNavbar';
import PageTransition from '../../components/PageTransition';
import { getAllTickets } from '../../services/ticketService';

function TicketsPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    const getStatusClass = (status) => {
        if (status === 'RESOLVED' || status === 'CLOSED') {
            return 'status-badge status-active';
        }

        if (status === 'REJECTED') {
            return 'status-badge status-out';
        }

        return 'status-badge';
    };

    return (
        <PageTransition>
            <>
                <AppNavbar />

                <div className="page-shell">
                    <div className="page-header">
                        <h1>Tickets</h1>
                        <p>Manage maintenance and incident reports.</p>
                    </div>

                    <div className="top-actions">
                        <Link to="/tickets/create" className="btn btn-primary link-btn">
                            Create Ticket
                        </Link>
                    </div>

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
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="empty-state">
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