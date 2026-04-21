export const formatDate = (dateString) => {
    if (!dateString) return '-';

    return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

export const formatTime = (timeString) => {
    if (!timeString) return '-';

    // Creates a safe date-time string so JavaScript can format the time properly.
    const tempDate = new Date(`1970-01-01T${timeString}`);

    return tempDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
};

export const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '-';

    return new Date(dateTimeString).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
};