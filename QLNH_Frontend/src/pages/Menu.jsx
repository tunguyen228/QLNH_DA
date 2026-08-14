import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function Menu() {
    // Lấy tableId từ URL (ví dụ URL là /menu/1 thì tableId = 1)
    const { tableId } = useParams();
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Gọi API backend khi component vừa load
        const fetchMenu = async () => {
            try {
                // Thay đổi URL phù hợp với cổng backend đang chạy
                const response = await fetch('https://localhost:5001/api/menu');
                const data = await response.json();
                setMenuItems(data);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi tải menu:", error);
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    if (loading) return <div>Đang tải thực đơn...</div>;

    return (
        <div className="menu-page">
            <h2>
                Thực đơn {tableId ? `- Đang order cho Bàn ${tableId}` : ''}
            </h2>

            <div className="menu-grid">
                {menuItems.map(item => (
                    <div key={item.id} className="menu-card">
                        <h3>{item.name}</h3>
                        <p>Danh mục: {item.category}</p>
                        <p>Giá: {item.price.toLocaleString()} VNĐ</p>
                        <button>Thêm vào bàn</button>
                    </div>
                ))}
            </div>
        </div>
    );
}