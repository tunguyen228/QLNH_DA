import axios from 'axios';

const host = window.location.hostname;
const API_BASE_URL = `http://${host}:5000/api`;
export const getAllStaff = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/NhanVien`); // Đảm bảo route này khớp với Controller bên C# của bạn
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tải danh sách nhân viên:", error);
        return [];
    }
};
export const createStaff = async (staffData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/NhanVien`, staffData);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thêm nhân viên:", error);
        throw error;
    }
};
export const deleteStaff = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/NhanVien/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi xóa nhân viên ${id}:`, error);
        throw error;
    }
};
export const getDashboardStats = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/Dashboard/stats`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thống kê:", error);
        return null;
    }
};