import axios from 'axios';

const host = window.location.hostname;
const API_BASE_URL = `http://${host}:5000/api`;
export const getTableMap = async () => {
    const response = await fetch(`${API_BASE_URL}/waiter/Table/map`);

    if (!response.ok) {
        throw new Error('Lỗi khi lấy dữ liệu từ server');
    }

    return response.json();
};
export const fetchAllTables = async () => {
    try {
        const dbData = await getTableMap();
        const allTablesRaw = dbData.areas.flatMap(area => area.tables);

        return allTablesRaw.map(table => ({
            maBan: table.id, 
            id: table.id,
            label: `Bàn ${table.id}`,
            trangThai: table.status === 1 ? 'Đang phục vụ' : 'Trống', 
            status: table.status,
            capacity: table.capacity,
            floor: table.floor,
        }));
    } catch (error) {
        console.error("Lỗi khi tải danh sách bàn:", error);
        return [];
    }
};
export const createTable = async (data) => (await axios.post(`${API_BASE_URL}/waiter/Table`, data)).data;
export const updateTable = async (id, data) => (await axios.put(`${API_BASE_URL}/waiter/Table/${id}`, data)).data;
export const deleteTable = async (id) => { await axios.delete(`${API_BASE_URL}/waiter/Table/${id}`); };