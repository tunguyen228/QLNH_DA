// Cấu hình URL gốc của API - thay đổi phù hợp với cổng backend đang chạy
const API_BASE_URL = 'https://localhost:5001/api';

/**
 * 1. Hàm lấy danh sách nhóm món từ Backend
 * @returns {Promise<Array>} Danh sách nhóm món
 */
export const fetchCategories = async () => {
    try {
        // LƯU Ý: Đổi '/categories' thành endpoint thực tế của bạn (ví dụ: '/nhommon' hoặc '/danh-muc')
        const response = await fetch(`${API_BASE_URL}/categories`);

        if (!response.ok) {
            throw new Error(`Lỗi khi tải danh sách nhóm món: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Lỗi API fetchCategories:", error);
        return []; // Trả về mảng rỗng để giao diện không bị crash
    }
};

/**
 * 2. Hàm lấy danh sách món ăn và lọc theo nhóm món
 * @param {number} maNhom - ID của nhóm món (mặc định là 1 - Tất cả)
 * @returns {Promise<Array>} Danh sách món ăn đã được lọc
 */
export const fetchMenuItems = async (maNhom = 1) => {
    try {
        const response = await fetch(`${API_BASE_URL}/menu`);

        if (!response.ok) {
            throw new Error(`Lỗi khi tải menu: ${response.status}`);
        }

        const allItems = await response.json();

        // Xử lý lọc theo MaNhom (đảm bảo so sánh đúng kiểu int)
        // Quy ước: maNhom === 1 là hiển thị "Tất cả"
        if (parseInt(maNhom, 10) === 1) {
            return allItems;
        }

        // Lọc các món có MaNhom khớp với nhóm được chọn
        return allItems.filter(item => parseInt(item.MaNhom, 10) === parseInt(maNhom, 10));

    } catch (error) {
        console.error("Lỗi API fetchMenuItems:", error);
        return [];
    }
};

/**
 * 3. Hàm gốc của bạn (Giữ lại nếu các file khác như TheoDoiMon.jsx vẫn đang gọi tới nó)
 */
export const getMenuItems = async () => {
    const response = await fetch(`${API_BASE_URL}/menu`);

    if (!response.ok) {
        throw new Error(`Lỗi khi tải menu: ${response.status}`);
    }

    return response.json();
};