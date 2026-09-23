import axios from 'axios';

const host = window.location.hostname;
const API_BASE_URL = `http://${host}:5000/api/kitchen`;
export const getKitchenStaff = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/staff`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách nhân viên bếp:", error);
        return []; 
    }
};
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
export const updateOrderStatus = async (maPhieu, maMon, TrangThai) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/CapNhatTrangThai`, {
            phieuGoiId: maPhieu,
            monAnId: maMon,
            trangThai: TrangThai
        });
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi cập nhật trạng thái món (Phiếu: ${maPhieu}, Món: ${maMon}):`, error);
        throw error;
    }
};