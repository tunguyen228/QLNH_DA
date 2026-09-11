import axios from 'axios';

const host = window.location.hostname;
const API_BASE_URL = `http://${host}:5000/api`;

export const fetchCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Categories`);
        if (!response.ok) throw new Error(`Lỗi tải nhóm món: ${response.status}`);
        const data = await response.json();
        return [{ MaNhom: 0, TenNhom: 'Tất cả' }, ...data];
    } catch (error) {
        console.error("Lỗi API fetchCategories:", error);
        return [{ MaNhom: 0, TenNhom: 'Tất cả' }];
    }
};

// Lấy toàn bộ món (Dùng cho Quản lý)
export const getMenuItems = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/MonAn`);
        return response.data;
    } catch (error) {
        console.error("Lỗi API getMenuItems:", error);
        return [];
    }
};

// Lấy món đang kinh doanh (Dùng cho Menu khách/Phục vụ)
export const getMenuKhach = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/MonAn/menu-khach`);
        return response.data;
    } catch (error) {
        console.error("Lỗi API getMenuKhach:", error);
        return [];
    }
};

// Bật/tắt trạng thái tạm hết trên RAM
export const toggleTamHet = async (id) => {
    const response = await axios.patch(`${API_BASE_URL}/MonAn/${id}/tam-het`);
    return response.data;
};

export const createMenuItem = async (data) => (await axios.post(`${API_BASE_URL}/MonAn`, data)).data;
export const updateMenuItem = async (id, data) => (await axios.put(`${API_BASE_URL}/MonAn/${id}`, data)).data;
export const deleteMenuItem = async (id) => { await axios.delete(`${API_BASE_URL}/MonAn/${id}`); };

export const getAllNhomMon = async () => (await axios.get(`${API_BASE_URL}/NhomMon`)).data;
export const createNhomMon = async (data) => (await axios.post(`${API_BASE_URL}/NhomMon`, data)).data;
export const deleteNhomMon = async (id) => { await axios.delete(`${API_BASE_URL}/NhomMon/${id}`); };

export const sendOrderToKitchen = async (tableId, maNv, cartItems) => {
    const payload = {
        tableId: tableId,
        maNv: maNv,
        items: cartItems.map(item => ({
            monAnId: item.id,
            soLuong: item.qty,
            ghiChu: item.note || item.ghiChu || ""
        }))
    };
    const response = await axios.post(`${API_BASE_URL}/Menu/SendOrder`, payload);
    return response.data;
};

export const sendQRClientOrder = async (maBan, cartItems) => {
    const payload = {
        maBan: Number(maBan),
        items: cartItems.map(item => ({
            maMon: item.id,
            soLuong: item.qty,
            ghiChu: item.note || item.ghiChu || ""
        }))
    };
    const response = await axios.post(`${API_BASE_URL}/Order/qr-order`, payload);
    return response.data;
};