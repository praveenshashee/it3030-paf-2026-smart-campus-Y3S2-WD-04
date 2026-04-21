import axiosInstance from '../api/axiosConfig';

export const getAllUsers = () => {
  return axiosInstance.get('/users');
};

export const updateUserRole = (id, role) => {
  return axiosInstance.put(`/users/${id}/role`, { role });
};