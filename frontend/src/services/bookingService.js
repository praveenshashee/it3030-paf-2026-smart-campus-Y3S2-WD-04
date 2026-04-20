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