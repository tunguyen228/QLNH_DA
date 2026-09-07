import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginForm from './pages/LoginForm';
import GiaoDienPhucVu from './pages/GiaoDienPhucVu';
import TableMap from './pages/TableMap';
import Menu from './pages/Menu';
import TheoDoiMon from './pages/TheoDoiMon';
import Kitchen from './pages/Kitchen';
import QuanLy from './pages/QuanLy'; // Thêm trang Quản lý
import { ToastProvider } from './contexts/ToastProvider';
import GiaoDienThanhToan from './pages/GiaoDienThanhToan';
import { NotificationProvider } from './contexts/NotificationProvider.jsx';
import TransactionHistory from "./pages/TransactionHistory.jsx";
import TableQRGenerator from './pages/TableQRGenerator';

// Component bảo vệ Route: Kiểm tra cả Token (Đã đăng nhập) và Role (Có quyền)
const ProtectedRoute = ({ allowedRoles, children }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children ? children : <Outlet />;
};

function App() {
    return (
        <ToastProvider>
            <NotificationProvider>
                <Routes>
                    {/* Trang đăng nhập chung */}
                    <Route path="/" element={<LoginForm />} />

                    {/* Trang xem và in danh sách mã QR */}
                    <Route path="/qr-tables" element={<TableQRGenerator />} />

                    {/* ========================================================= */}
                    {/* KHU VỰC DÀNH CHO KHÁCH QUÉT QR (KHÔNG CẦN ĐĂNG NHẬP)        */}
                    {/* ========================================================= */}
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/menu/:tableId" element={<Menu />} />

                    {/* Route báo lỗi khi cố truy cập trái phép */}
                    <Route path="/unauthorized" element={<h2 style={{textAlign: 'center', marginTop: '50px'}}>Bạn không có quyền truy cập trang này!</h2>} />

                    {/* NHÓM QUYỀN: PHỤC VỤ */}
                    <Route path="/phuc-vu" element={
                        <ProtectedRoute allowedRoles={['Phục vụ']}>
                            <GiaoDienPhucVu />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Navigate to="tables" replace />} />
                        <Route path="tables" element={<TableMap />} />
                        <Route path="menu" element={<Menu />} />
                        <Route path="theodoi" element={<TheoDoiMon />} />
                        <Route path="menu/:tableId" element={<Menu />} />
                    </Route>

                    {/* NHÓM QUYỀN: BẾP */}
                    <Route path="/bep" element={
                        <ProtectedRoute allowedRoles={['Bếp']}>
                            <Kitchen />
                        </ProtectedRoute>
                    } />

                    {/* NHÓM QUYỀN: THU NGÂN */}
                    <Route element={<ProtectedRoute allowedRoles={['Thu ngân']} />}>
                        <Route path="/thu-ngan" element={<Navigate to="/thu-ngan/thanh-toan" replace />} />
                        <Route path="/thu-ngan/thanh-toan" element={<GiaoDienThanhToan />} />
                        <Route path="/thu-ngan/lich-su" element={<TransactionHistory />} />
                    </Route>

                    {/* NHÓM QUYỀN: QUẢN LÝ / ADMIN */}
                    <Route path="/quan-ly/*" element={
                        <ProtectedRoute allowedRoles={['Quản lý']}>
                            <QuanLy />
                        </ProtectedRoute>
                    } />

                </Routes>
            </NotificationProvider>
        </ToastProvider>
    );
}

export default App;