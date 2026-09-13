import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import SidebarThuNgan from '../components/SidebarThuNgan';

const GiaoDienThanhToan = () => {
    const navigate = useNavigate();
    const tenThuNgan = localStorage.getItem('hoTen') || 'Thu Ngân';

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="d-flex" style={{ height: '100vh', backgroundColor: '#fcfaf5' }}>
            <div style={{ flexShrink: 0 }}>
                <SidebarThuNgan hoTen={tenThuNgan} onLogout={handleLogout} />
            </div>
            <div className="flex-grow-1 overflow-hidden" style={{ minWidth: 0 }}>
                <Outlet />
            </div>
        </div>
    );
};

export default GiaoDienThanhToan;