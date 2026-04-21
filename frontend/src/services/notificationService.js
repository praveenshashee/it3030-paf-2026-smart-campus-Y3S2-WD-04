import axiosInstance from '../api/axiosConfig';

export const getAllNotifications = () => {
    return axiosInstance.get('/notifications');
};

export const markNotificationAsRead = (id) => {
    return axiosInstance.put(`/notifications/${id}/read`);
};

// Marks every unread notification as read by calling the existing endpoint one by one.
export const markAllNotificationsAsRead = async (notifications) => {
    const unreadNotifications = notifications.filter(
        (notification) => !notification.isRead
    );

    await Promise.all(
        unreadNotifications.map((notification) =>
            axiosInstance.put(`/notifications/${notification.id}/read`)
        )
    );
};