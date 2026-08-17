import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/kitchen';

export const getPendingOrders = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/orders?status=pending`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách chờ nấu:", error);
        return []; 
    }
};

export const getCookingOrders = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/orders?status=cooking`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách đang nấu:", error);
        return [];
    }
};

export const startCookingOrder = async (orderId) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/orders/${orderId}/start`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi bắt đầu nấu món ID ${orderId}:`, error);
        throw error; 
    }
};

export const finishCookingOrder = async (orderId) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/orders/${orderId}/finish`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi hoàn thành món ID ${orderId}:`, error);
        throw error;
    }
};