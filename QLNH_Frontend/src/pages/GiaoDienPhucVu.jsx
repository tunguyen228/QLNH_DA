import React from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const GiaoDienPhucVu = () => {
    const navigate = useNavigate();
    const hoTen = localStorage.getItem('hoTen');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <Container fluid className="p-0" style={{ height: '100vh', display: 'flex' }}>
            <div style={{ flexShrink: 0 }}>
                <Sidebar hoTen={hoTen} onLogout={handleLogout} />
            </div>
            <div className="main-content flex-grow-1" style={{ overflowY: 'auto', backgroundColor: '#fcfaf5' }}>
                <Outlet />
            </div>
        </Container>
    );
};

export default GiaoDienPhucVu;