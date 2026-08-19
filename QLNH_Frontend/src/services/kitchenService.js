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

export const startCookingOrder = async (maPhieu, maMon) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/orders/${maPhieu}/${maMon}/start`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi bắt đầu nấu món (Phiếu: ${maPhieu}, Món: ${maMon}):`, error);
        throw error;
    }
};

export const finishCookingOrder = async (maPhieu, maMon) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/orders/${maPhieu}/${maMon}/finish`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi hoàn thành món (Phiếu: ${maPhieu}, Món: ${maMon}):`, error);
        throw error;
    }
};

// Thêm vào cuối file kitchenService.js
export const getKitchenStaff = async () => {
    try {
        // TẠM THỜI DÙNG DỮ LIỆU GIẢ: 
        // Thay đoạn này bằng axios.get('/api/nhanvien/bep') khi bạn đã viết xong API C#
        return [
            { id: 1, hoTen: "Trần Văn Hùng", chucVu: "Bếp Trưởng", trangThai: "Đang làm", isOnline: true, avatar: "" },
            { id: 2, hoTen: "Lê Minh Tuấn", chucVu: "Bếp Phó", trangThai: "Đang làm", isOnline: true, avatar: "" },
            { id: 3, hoTen: "Nguyễn Thảo Chi", chucVu: "Phụ Bếp", trangThai: "Đang nghỉ", isOnline: false, avatar: "" }
        ];
    } catch (error) {
        console.error("Lỗi khi lấy danh sách nhân viên bếp:", error);
        return [];
    }
};