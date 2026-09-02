import React, { useState, useRef, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import { useNotifications } from '../contexts/NotificationProvider';
import '../CSS/NotificationBell.css';

const NotificationBell = () => {
    const { notifications, unreadCount, markAllAsRead, clearAll } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = () => {
        const next = !isOpen;
        setIsOpen(next);
        if (next) {
            markAllAsRead(); // Mở chuông ra là hết đỏ, đúng ý "giữ đến khi xem"
        }
    };

    return (
        <div className="notification-bell-wrapper" ref={wrapperRef}>
            <button className="notification-bell-btn" onClick={handleToggle} aria-label="Thông báo">
                <FaBell />
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-dropdown-header">
                        <span>Thông báo</span>
                        {notifications.length > 0 && (
                            <button className="notification-clear-btn" onClick={clearAll}>Xóa tất cả</button>
                        )}
                    </div>
                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <div className="notification-empty">Chưa có thông báo nào</div>
                        ) : (
                            notifications.map(n => (
                                <div key={n.id} className="notification-item">
                                    <div className="notification-item-title">
                                        Bàn {n.maBan} — {n.tenMon}
                                    </div>
                                    <div className="notification-item-sub">Đã chế biến xong, sẵn sàng phục vụ</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;