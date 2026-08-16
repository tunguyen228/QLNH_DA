const API_BASE_URL = 'http://localhost:5000/api';

export const fetchCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Categories`);

        if (!response.ok) {
            throw new Error(`Lỗi khi tải danh sách nhóm món: ${response.status}`);
        }

        const data = await response.json();

        // Tự động chèn danh mục "Tất cả" với MaNhom = 0
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