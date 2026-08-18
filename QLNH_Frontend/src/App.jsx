import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './pages/LoginForm';
import GiaoDienPhucVu from './pages/GiaoDienPhucVu';
import TableMap from './pages/TableMap';
import Menu from './pages/Menu';
import TheoDoiMon from './pages/TheoDoiMon';
import Kitchen from './pages/Kitchen';
import { ToastProvider } from './contexts/ToastProvider';

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
        <Routes>
            <Route path="/" element={<LoginForm />} />

            <Route
                path="/phuc-vu"
                element={
                    <ProtectedRoute>
                        <GiaoDienPhucVu />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="tables" replace />} />
                <Route path="tables" element={<TableMap />} />
                <Route path="menu" element={<Menu />} />
                <Route path="theodoi" element={<TheoDoiMon />} />
                <Route path="menu/:tableId" element={<Menu />} />
            </Route>

            <Route
                path="/bep"
                element={
                    <ProtectedRoute>
                        <Kitchen />
                    </ProtectedRoute>
                }
            >
            </Route>
        </Routes>
        </ToastProvider>
    );
}

export default App;