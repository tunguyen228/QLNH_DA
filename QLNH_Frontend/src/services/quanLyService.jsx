import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// --- QUẢN LÝ NHÂN VIÊN ---
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

// --- THỐNG KÊ / BÁO CÁO (Trang chủ) ---
export const getDashboardStats = async () => {
    try {
        // Bạn có thể tạo một API tương ứng ở Backend C# để trả về doanh thu, tổng đơn,...
        const response = await axios.get(`${API_BASE_URL}/Dashboard/stats`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thống kê:", error);
        return null;
    }
};