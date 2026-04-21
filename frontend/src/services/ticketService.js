import axiosInstance from '../api/axiosConfig';

export const getAllTickets = () => {
    return axiosInstance.get('/tickets');
};

export const getTicketById = (id) => {
    return axiosInstance.get(`/tickets/${id}`);
};

export const createTicket = (ticketData) => {
    return axiosInstance.post('/tickets', ticketData);
};

export const updateTicketStatus = (id, statusData) => {
    return axiosInstance.put(`/tickets/${id}/status`, statusData);
};