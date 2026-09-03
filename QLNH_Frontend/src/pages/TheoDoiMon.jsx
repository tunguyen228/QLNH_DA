import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import axios from 'axios';
import { FaRegClock, FaCheckCircle, FaFire } from 'react-icons/fa';
import { useNotifications } from '../contexts/NotificationProvider';
import '../CSS/TheoDoiMon.css';

const TheoDoiMon = () => {
    const [orders, setOrders] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const { markAllAsRead } = useNotifications();

    // Vào tab này thì coi như đã xem hết thông báo -> tắt chấm đỏ trên Sidebar
    useEffect(() => {
        markAllAsRead();
    }, [markAllAsRead]);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now);
            if (now.getHours() === 0 && now.getMinutes() === 0) {
                fetchOrders();
            }
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/order/danhsach');
            setOrders(response.data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách đơn:", error);
        }
    };

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl("http://localhost:5000/notificationHub")
            .withAutomaticReconnect()
            .build();

        connection.start().catch(err => console.error("SignalR Error: ", err));

        connection.on("DishStatusUpdated", (data) => {
            setOrders(prevOrders => prevOrders.map(order => {
                if (order.maPhieu === data.maPhieu) {
                    return {
                        ...order,
                        chiTiet: order.chiTiet.map(mon =>
                            mon.maMon === data.maMon ? { ...mon, trangThai: data.trangThai } : mon
                        )
                    };
                }
                return order;
            }));
        });

        return () => connection.stop();
    }, []);

    const handleServeDish = async (maPhieu, maMon) => {
        try {
            await axios.put(`http://localhost:5000/api/order/${maPhieu}/mon/${maMon}/serve`);
            setOrders(prevOrders => prevOrders.map(order => {
                if (order.maPhieu === maPhieu) {
                    return {
                        ...order,
                        chiTiet: order.chiTiet.map(mon =>
                            mon.maMon === maMon ? { ...mon, trangThai: 'DaPhucVu' } : mon
                        )
                    };
                }
                return order;
            }));
        } catch (error) {
            console.error("Lỗi:", error);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN').format(amount || 0) + ' đ';
    };

    const calculateWaitTime = (thoiGianGoi) => {
        if (!thoiGianGoi) return 0;
        const diffMs = currentTime - new Date(thoiGianGoi);
        return Math.floor(diffMs / 60000);
    };

    const READY_STATUSES = ['HoanThanh', 'DaXong'];

    const getStatusInfo = (trangThai) => {
        switch (trangThai) {
            case 'ChoCheBien':
                return { label: 'Chờ chế biến', icon: <FaRegClock />, className: 'status-cho-che-bien' };
            case 'DangCheBien':
                return { label: 'Đang chế biến', icon: <FaFire />, className: 'status-dang-che-bien' };
            case 'HoanThanh':
            case 'DaXong':
                return { label: 'Đã chế biến xong', icon: <FaCheckCircle />, className: 'status-da-xong' };
            case 'DaPhucVu':
                return { label: 'Đã phục vụ', icon: <FaCheckCircle />, className: 'status-da-phuc-vu' };
            default:
                return { label: trangThai, icon: null, className: '' };
        }
    };

    return (
        <div className="order-management-container">
            <div className="header-section">
                <h2>Quản lý Order</h2>
            </div>

            <div className="orders-grid">
                {orders.map((order) => {
                    const isFullyServed = order.chiTiet.every(m => m.trangThai === 'DaPhucVu');
                    const waitTime = calculateWaitTime(order.thoiGianTao);

                    return (
                        <div className="order-card" key={order.maPhieu}>
                            <div className="order-card-header">
                                <div className="header-left">
                                    <h3 className="order-id">MÃ ĐƠN: #{order.maPhieu.toString().padStart(4, '0')}</h3>
                                    {isFullyServed ? (
                                        <span className="status-done">
                                            <FaCheckCircle className="icon" /> Đã phục vụ xong
                                        </span>
                                    ) : (
                                        <span className="status-waiting">
                                            <FaRegClock className="icon" /> Chờ: {waitTime} phút
                                        </span>
                                    )}
                                </div>
                                <div className="table-badge">Bàn {order.tenBan}</div>
                            </div>

                            <div className="order-items">
                                {order.chiTiet.map((mon, index) => {
                                    const isServed = mon.trangThai === 'DaPhucVu';
                                    const isReadyToServe = READY_STATUSES.includes(mon.trangThai);
                                    const statusInfo = getStatusInfo(mon.trangThai);

                                    return (
                                        <div className="item-row" key={index}>
                                            <div className="item-info">
                                                <div className={`item-name ${isServed ? 'text-served' : ''}`}>
                                                    {mon.tenMon}
                                                </div>
                                                {mon.ghiChu && (
                                                    <div className={`item-note ${isServed ? 'text-served' : ''}`}>
                                                        {mon.ghiChu}
                                                    </div>
                                                )}
                                                <div className={`item-status-badge ${statusInfo.className}`}>
                                                    {statusInfo.icon}
                                                    {statusInfo.label}
                                                </div>
                                            </div>
                                            <div className="item-actions">
                                                <span className={`item-quantity ${isServed ? 'badge-served' : ''}`}>
                                                    x{mon.soLuong}
                                                </span>
                                                <input
                                                    type="checkbox"
                                                    className="serve-checkbox"
                                                    disabled={!isReadyToServe}
                                                    checked={isServed}
                                                    onChange={() => handleServeDish(order.maPhieu, mon.maMon)}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="order-footer">
                                <span className="footer-label">Tạm tính:</span>
                                <span className="total-amount">{formatCurrency(order.tongTien)}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TheoDoiMon;