import React from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate, Outlet } from 'react-router-dom';
import SidebarPhucVu from '../components/SidebarPhucVu';
import { NotificationProvider, useNotifications } from '../contexts/NotificationProvider';

const GiaoDienPhucVuContent = () => {
    const navigate = useNavigate();
    const hoTen = localStorage.getItem('hoTen');
    const { tableRefreshTrigger } = useNotifications();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <Container fluid className="p-0" style={{ height: '100vh', display: 'flex' }}>
            <div style={{ flexShrink: 0 }}>
                <SidebarPhucVu hoTen={hoTen} onLogout={handleLogout} />
            </div>
            <div className="main-content flex-grow-1" style={{ overflowY: 'auto', backgroundColor: '#fcfaf5' }}>
                {/* Truyền trigger xuống qua context của react-router */}
                <Outlet context={{ tableRefreshTrigger }} />
            </div>
        </Container>
    );
};

const GiaoDienPhucVu = () => {
    return (
        <NotificationProvider>
            <GiaoDienPhucVuContent />
        </NotificationProvider>
    );
};

export default GiaoDienPhucVu;