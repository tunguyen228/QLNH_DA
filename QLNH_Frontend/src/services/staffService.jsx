// File: services/staffService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getAllStaff = async () => {
    const response = await axios.get(`${API_BASE_URL}/NhanVien`);
    return response.data;
};

export const createStaff = async (staffData) => {
    const response = await axios.post(`${API_BASE_URL}/NhanVien`, staffData);
    return response.data;
};

export const updateStaff = async (id, staffData) => {
    const response = await axios.put(`${API_BASE_URL}/NhanVien/${id}`, staffData);
    return response.data;
};

export const deleteStaff = async (id) => {
    await axios.delete(`${API_BASE_URL}/NhanVien/${id}`);
};