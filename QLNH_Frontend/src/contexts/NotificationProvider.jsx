import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import * as signalR from "@microsoft/signalr";

const NotificationContext = createContext(null);

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl("http://localhost:5000/notificationHub", { // Lưu ý thay đúng URL backend của bạn nếu đang dùng port khác
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .build();

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
            };

            setNotifications(prev => [newItem, ...prev].slice(0, 30));
        });

        connection.start().catch(err => console.error("SignalR (Notification) Error: ", err));

        return () => connection.stop();
    }, []);

    // useCallback giữ nguyên tham chiếu hàm giữa các lần render.
    // Thiếu bước này chính là nguyên nhân gây "Maximum update depth exceeded":
    // Provider render lại -> hàm này bị tạo mới -> nơi nào có [markAllAsRead]
    // trong dependency array của useEffect (như TheoDoiMon.jsx) sẽ chạy lại vô hạn.
    const markAllAsRead = useCallback(() => {
        setNotifications(prev => {
            const hasUnread = prev.some(n => !n.read);
            if (!hasUnread) return prev; // Không có gì đổi -> React tự bỏ qua, không render thừa
            return prev.map(n => ({ ...n, read: true }));
        });
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead, clearAll }}>
            {children}
        </NotificationContext.Provider>
    );
};