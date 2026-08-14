const API_BASE_URL = 'http://localhost:5000/api/waiter';

// Lấy sơ đồ bàn (danh sách khu vực + bàn trong từng khu vực)
export const getTableMap = async () => {
    const response = await fetch(`${API_BASE_URL}/Table/map`);

    if (!response.ok) {
        throw new Error('Lỗi khi lấy dữ liệu từ server');
    }

    return response.json();
};