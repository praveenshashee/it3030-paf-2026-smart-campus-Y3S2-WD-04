import axiosInstance from '../api/axiosConfig';

export const getAllBookings = () => {
    return axiosInstance.get('/bookings');
};

export const getBookingById = (id) => {
    return axiosInstance.get(`/bookings/${id}`);
};

export const createBooking = (bookingData) => {
    return axiosInstance.post('/bookings', bookingData);
};

export const approveBooking = (id) => {
    return axiosInstance.put(`/bookings/${id}/approve`);
};

export const rejectBooking = (id, reason) => {
    return axiosInstance.put(`/bookings/${id}/reject`, { reason });
};

export const cancelBooking = (id, reason) => {
    return axiosInstance.put(`/bookings/${id}/cancel`, { reason });
};