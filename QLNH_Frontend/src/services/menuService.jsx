import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Categories`);

        if (!response.ok) {
            throw new Error(`Lỗi khi tải danh sách nhóm món: ${response.status}`);
        }

        const data = await response.json();

        return [{ MaNhom: 0, TenNhom: 'Tất cả' }, ...data];

    } catch (error) {
        console.error("Lỗi API fetchCategories:", error);
        return [{ MaNhom: 0, TenNhom: 'Tất cả' }];
    }
};

export const getMenuItems = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Menu`);

        if (!response.ok) {
            throw new Error(`Lỗi khi tải menu: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Lỗi API getMenuItems:", error);
        return [];
    }
};

// Dành cho NHÂN VIÊN đã đăng nhập - cần maNv
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

// NEW: Dành cho KHÁCH quét mã QR - không cần đăng nhập, không cần maNv
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

export const createMenuItem = async (data) => (await axios.post(`${API_BASE_URL}/MonAn`, data)).data;
export const updateMenuItem = async (id, data) => (await axios.put(`${API_BASE_URL}/MonAn/${id}`, data)).data;
export const deleteMenuItem = async (id) => { await axios.delete(`${API_BASE_URL}/MonAn/${id}`); };

export const getAllNhomMon = async () => (await axios.get(`${API_BASE_URL}/NhomMon`)).data;
export const createNhomMon = async (data) => (await axios.post(`${API_BASE_URL}/NhomMon`, data)).data;
export const deleteNhomMon = async (id) => { await axios.delete(`${API_BASE_URL}/NhomMon/${id}`); };