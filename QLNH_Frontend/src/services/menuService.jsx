// Cấu hình URL gốc của API - thay đổi phù hợp với cổng backend đang chạy
const API_BASE_URL = 'https://localhost:5001/api';

// Lấy danh sách toàn bộ món ăn trong thực đơn
export const getMenuItems = async () => {
    const response = await fetch(`${API_BASE_URL}/menu`);

    if (!response.ok) {
        throw new Error(`Lỗi khi tải menu: ${response.status}`);
    }

    return response.json();
};