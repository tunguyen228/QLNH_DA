import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './pages/LoginForm';
import GiaoDienPhucVu from './pages/GiaoDienPhucVu';
import TableMap from './pages/TableMap';
import Menu from './pages/Menu';
import TheoDoiMon from './pages/TheoDoiMon';
import Kitchen from './pages/Kitchen';
import { ToastProvider } from './contexts/ToastProvider';
import GiaoDienThanhToan from './pages/GiaoDienThanhToan';

// THÊM DÒNG NÀY: Import NotificationProvider từ file context của bạn
// Hãy đảm bảo đường dẫn này khớp với vị trí file context trong project của bạn
import { NotificationProvider } from './contexts/NotificationProvider.jsx';

function App() {
    const ProtectedRoute = ({ children }) => {
        const token = localStorage.getItem('token');
        if (!token) {
            return <Navigate to="/" replace />;
        }
        return children;
    };

    return (
        <ToastProvider>
            {/* THÊM DÒNG NÀY: Bọc toàn bộ Routes bằng NotificationProvider */}
            <NotificationProvider>
                <Routes>
                    <Route path="/" element={<LoginForm />} />

                    <Route path="/phuc-vu" element={<ProtectedRoute><GiaoDienPhucVu /></ProtectedRoute>}>
                        <Route index element={<Navigate to="tables" replace />} />
                        <Route path="tables" element={<TableMap />} />
                        <Route path="menu" element={<Menu />} />
                        <Route path="theodoi" element={<TheoDoiMon />} />
                        <Route path="menu/:tableId" element={<Menu />} />
                    </Route>

                    <Route path="/bep" element={<Kitchen />} />

                    <Route>
                        {/* Khi truy cập gốc /thu-ngan sẽ tự động đẩy sang /thu-ngan/thanh-toan */}
                        <Route path="/thu-ngan" element={<Navigate to="/thu-ngan/thanh-toan" replace />} />

                        {/* Route chính cho giao diện thanh toán */}
                        <Route path="/thu-ngan/thanh-toan" element={<GiaoDienThanhToan />} />

                        {/* Route cho lịch sử (bạn có thể tạo component này sau) */}
                        <Route path="/thu-ngan/lich-su" element={<div>Trang lịch sử</div>} />

                        {/* ... các routes khác của hệ thống */}
                    </Route>
                </Routes>
            </NotificationProvider>
        </ToastProvider>
    );
}

export default App;