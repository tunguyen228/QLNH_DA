import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getTableMap = async () => {
    const response = await fetch(`${API_BASE_URL}/waiter/Table/map`);

    if (!response.ok) {
        throw new Error('Lỗi khi lấy dữ liệu từ server');
    }

    return response.json();
};

// Đổi tên thành getAllTables để khớp với QuanLy.jsx
export const fetchAllTables = async () => {
    try {
        const dbData = await getTableMap();
        const allTablesRaw = dbData.areas.flatMap(area => area.tables);

        return allTablesRaw.map(table => ({
            maBan: table.id, // Giữ tương thích với cấu trúc hiển thị trong QuanLy.jsx (b.maBan)
            id: table.id,
            label: `Bàn ${table.id}`,
            trangThai: table.status === 1 ? 'Đang phục vụ' : 'Trống', // Đồng bộ trạng thái hiển thị
            status: table.status,
            capacity: table.capacity,
            floor: table.floor,
        }));
    } catch (error) {
        console.error("Lỗi khi tải danh sách bàn:", error);
        return [];
    }
};

// Sửa lại đường dẫn API thành /Table cho khớp với TableController phía Backend
export const createTable = async (data) => (await axios.post(`${API_BASE_URL}/waiter/Table`, data)).data;
export const updateTable = async (id, data) => (await axios.put(`${API_BASE_URL}/waiter/Table/${id}`, data)).data;
export const deleteTable = async (id) => { await axios.delete(`${API_BASE_URL}/waiter/Table/${id}`); };