import axiosInstance from '../api/axiosConfig';

// Gets all resources from the backend API.
export const getAllResources = () => {
    return axiosInstance.get('/resources');
};

// Sends a new resource to the backend API.
export const createResource = (resourceData) => {
    return axiosInstance.post('/resources', resourceData);
};