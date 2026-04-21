import axiosInstance from '../api/axiosConfig';

export const getAllNotifications = () => {
    return axiosInstance.get('/notifications');
};

export const markNotificationAsRead = (id) => {
    return axiosInstance.put(`/notifications/${id}/read`);
};