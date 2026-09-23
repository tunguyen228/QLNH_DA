import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginForm from './pages/LoginForm';
import GiaoDienPhucVu from './pages/GiaoDienPhucVu';
import TableMap from './pages/TableMap';
import Menu from './pages/Menu';
import TheoDoiMon from './pages/TheoDoiMon';
import Kitchen from './pages/Kitchen';
import QuanLy from './pages/QuanLy'; 
import { ToastProvider } from './contexts/ToastProvider';
import GiaoDienThanhToan from './pages/GiaoDienThanhToan';
import { NotificationProvider } from './contexts/NotificationProvider.jsx';
import TransactionHistory from "./pages/TransactionHistory.jsx";
import TableQRGenerator from './pages/TableQRGenerator';
import TableModal from './components/TableModal'; 
import Checkout from './pages/Checkout';

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
                    <Route path="/" element={<LoginForm />} />
                    <Route path="/qr-tables" element={<TableQRGenerator />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/menu/:tableId" element={<Menu />} />
                    <Route path="/unauthorized" element={<h2 style={{textAlign: 'center', marginTop: '50px'}}>Bạn không có quyền truy cập trang này!</h2>} />
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
                    <Route path="/bep" element={
                        <ProtectedRoute allowedRoles={['Bếp']}>
                            <Kitchen />
                        </ProtectedRoute>
                    } />
                    <Route path="/thu-ngan" element={<GiaoDienThanhToan />}>
                        <Route index element={<Checkout />} />
                        <Route path="thanh-toan" element={<Checkout />} />
                        <Route path="lich-su" element={<TransactionHistory />} />
                    </Route>
                    <Route path="/quan-ly/*" element={
                        <ProtectedRoute allowedRoles={['Quản lý']}>
                            <QuanLy />
                        </ProtectedRoute>
                    }>
                        <Route path="ban-an" element={<TableModal />} />
                    </Route>
                </Routes>
            </NotificationProvider>
        </ToastProvider>
    );
}

export default App;