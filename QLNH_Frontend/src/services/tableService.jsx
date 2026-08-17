const API_BASE_URL = 'http://localhost:5000/api/waiter';

export const getTableMap = async () => {
    const response = await fetch(`${API_BASE_URL}/Table/map`);

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
            id: table.id,
            label: `Bàn ${table.id}`,
            status: table.status,
            capacity: table.capacity,
            floor: table.floor,
        }));
    } catch (error) {
        console.error("Lỗi khi tải danh sách bàn:", error);
        return [];
    }
};