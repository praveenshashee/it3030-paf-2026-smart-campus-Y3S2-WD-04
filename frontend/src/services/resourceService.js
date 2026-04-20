import axiosInstance from '../api/axiosConfig';

// Gets all resources from the backend API.
export const getAllResources = () => {
    return axiosInstance.get('/resources');
};