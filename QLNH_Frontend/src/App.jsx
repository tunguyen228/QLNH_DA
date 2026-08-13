import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import GiaoDienPhucVu from './pages/SideBar';
import TableMap from './pages/TableMap';
import Menu from './pages/Menu';
import TheoDoiMon from './pages/TheoDoiMon';

function App() {
    const ProtectedRoute = ({ children }) => {
        const token = localStorage.getItem('token');
        if (!token) {
            return <Navigate to="/" replace />;
        }
        return children;
    };

    return (
        <Routes>
            <Route path="/" element={<LoginForm />} />

            <Route
                path="/dashboard"
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
            </Route>
        </Routes>
    );
}

export default App;