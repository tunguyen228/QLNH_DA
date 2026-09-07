import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginForm from './pages/LoginForm';
import GiaoDienPhucVu from './pages/GiaoDienPhucVu';
import TableMap from './pages/TableMap';
import Menu from './pages/Menu';
import TheoDoiMon from './pages/TheoDoiMon';
import Kitchen from './pages/Kitchen';
import { ToastProvider } from './contexts/ToastProvider';
import GiaoDienThanhToan from './pages/GiaoDienThanhToan';
import { NotificationProvider } from './contexts/NotificationProvider.jsx';
import TransactionHistory from "./pages/TransactionHistory.jsx";

// Component bảo vệ Route: Kiểm tra cả Token (Đã đăng nhập) và Role (Có quyền)
const ProtectedRoute = ({ allowedRoles, children }) => {
    const token = localStorage.getItem('token');
    // GIẢ ĐỊNH: Bạn lưu role của user ở localStorage khi đăng nhập thành công
    const userRole = localStorage.getItem('role');

    if (!token) {
        // Chưa đăng nhập -> Về trang login
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Có token nhưng sai Role -> Đẩy về trang báo lỗi hoặc trang chủ
        return <Navigate to="/unauthorized" replace />;
    }

    // Nếu dùng bọc thẻ <Route element={...}> thì dùng <Outlet />, nếu bọc component thì dùng children
    return children ? children : <Outlet />;
};

function App() {
    return (
        <ToastProvider>
            <NotificationProvider>
                <Routes>
                    <Route path="/" element={<LoginForm />} />

                    {/* Route báo lỗi khi cố truy cập trái phép */}
                    <Route path="/unauthorized" element={<h2 style={{textAlign: 'center', marginTop: '50px'}}>Bạn không có quyền truy cập trang này!</h2>} />

                    {/* NHÓM QUYỀN: PHỤC VỤ (Hoặc Admin cũng vào được) */}
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

                </Routes>
            </NotificationProvider>
        </ToastProvider>
    );
}

export default App;