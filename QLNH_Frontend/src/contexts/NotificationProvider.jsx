import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as signalR from "@microsoft/signalr";

const NotificationContext = createContext(null);

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [kitchenRefreshTrigger, setKitchenRefreshTrigger] = useState(0); // Dùng để trigger reload data ở Bếp

    useEffect(() => {
        let isMounted = true;

        const host = window.location.hostname;

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`http://${host}:5000/notificationHub`, {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .build();

        // 1. Dành cho Phục vụ: Lắng nghe khi Bếp nấu xong
        connection.on("DishStatusUpdated", (data) => {
            const trangThai = data.trangThai ?? data.TrangThai;
            const isDone = trangThai === "DaXong" || trangThai === "HoanThanh";
            if (!isDone) return;

            const newItem = {
                id: `${data.maPhieu ?? data.MaPhieu}-${data.maMon ?? data.MaMon}-${Date.now()}`,
                maPhieu: data.maPhieu ?? data.MaPhieu,
                maMon: data.maMon ?? data.MaMon,
                tenMon: data.tenMon ?? data.TenMon ?? 'Món ăn',
                maBan: data.maBan ?? data.MaBan,
                read: false,
                thoiGian: new Date(),
                type: 'success'
            };

            setNotifications(prev => [newItem, ...prev].slice(0, 30));
        });

        // 2. Dành cho Bếp: Lắng nghe khi Phục vụ gọi món mới (Tùy chọn thêm để realtime)
        connection.on("NewOrderToKitchen", () => {
            // Thay đổi state để màn hình Bếp tự động fetch lại data mà không cần setInterval 10s
            setKitchenRefreshTrigger(prev => prev + 1);
        });

        const startConnection = async () => {
            try {
                await connection.start();
                if (!isMounted) {
                    await connection.stop();
                }
            } catch (err) {
                console.error("SignalR (Notification) Error: ", err);
            }
        };

        startConnection();

        return () => {
            isMounted = false;
            if (connection.state === signalR.HubConnectionState.Connected) {
                connection.stop();
            }
        };
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => {
            const hasUnread = prev.some(n => !n.read);
            if (!hasUnread) return prev;
            return prev.map(n => ({ ...n, read: true }));
        });
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            markAllAsRead,
            clearAll,
            kitchenRefreshTrigger // Export biến này ra để dùng ở Kitchen.jsx
        }}>
            {children}
        </NotificationContext.Provider>
    );
};