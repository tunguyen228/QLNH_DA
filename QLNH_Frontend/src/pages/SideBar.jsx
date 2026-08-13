import React from 'react';
import { Container, Nav } from 'react-bootstrap';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';

const GiaoDienPhucVu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const hoTen = localStorage.getItem('hoTen');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    // active tab dựa vào URL hiện tại, không cần state riêng nữa
    const isActive = (path) => location.pathname.startsWith(`/dashboard/${path}`);

    return (
        <Container fluid className="p-0" style={{ height: '100vh', display: 'flex' }}>
            <div className="bg-dark text-white d-flex flex-column" style={{ width: '250px', height: '100%' }}>
                <div className="p-3 text-center border-bottom border-secondary">
                    <h5>POS Nhà Hàng</h5>
                    <small className="text-muted">Xin chào, {hoTen || 'Nhân viên'}</small>
                </div>

                <Nav className="flex-column flex-grow-1 p-2" variant="pills">
                    <Nav.Link
                        as={Link}
                        to="tables"
                        className={`text-white mb-2 ${isActive('tables') ? 'bg-primary' : ''}`}
                    >
                        🗺️ Sơ đồ bàn ăn
                    </Nav.Link>

                    <Nav.Link
                        as={Link}
                        to="menu"
                        className={`text-white mb-2 ${isActive('menu') ? 'bg-primary' : ''}`}
                    >
                        🍔 Menu gọi món
                    </Nav.Link>

                    <Nav.Link
                        as={Link}
                        to="theodoi"
                        className={`text-white mb-2 ${isActive('theodoi') ? 'bg-primary' : ''}`}
                    >
                        🕒 Theo dõi món
                    </Nav.Link>
                </Nav>

                <div className="p-3 border-top border-secondary">
                    <Nav.Link className="text-danger font-weight-bold" onClick={handleLogout}>
                        🚪 Đăng xuất
                    </Nav.Link>
                </div>
            </div>

            <div className="main-content flex-grow-1 bg-light p-4" style={{ overflowY: 'auto' }}>
                <Outlet />
            </div>
        </Container>
    );
};

export default GiaoDienPhucVu;