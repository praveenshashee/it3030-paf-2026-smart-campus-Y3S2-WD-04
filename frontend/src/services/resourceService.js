import axiosInstance from '../api/axiosConfig';

export const getAllResources = () => {
    return axiosInstance.get('/resources');
};

export const getResourceById = (id) => {
    return axiosInstance.get(`/resources/${id}`);
};

export const createResource = (resourceData) => {
    return axiosInstance.post('/resources', resourceData);
};

export const updateResource = (id, resourceData) => {
    return axiosInstance.put(`/resources/${id}`, resourceData);
};

export const deleteResource = (id) => {
    return axiosInstance.delete(`/resources/${id}`);
};