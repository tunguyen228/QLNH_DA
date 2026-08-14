import React from 'react';
import { Nav } from 'react-bootstrap';
import SidebarNavItem from './SidebarNavItem';

const NAV_ITEMS = [
    { to: 'tables', icon: '🗺️', label: 'Sơ đồ bàn ăn' },
    { to: 'menu', icon: '🍔', label: 'Menu gọi món' },
    { to: 'theodoi', icon: '🕒', label: 'Theo dõi món' },
];

const Sidebar = ({ hoTen, onLogout }) => {
    return (
        <div className="bg-dark text-white d-flex flex-column" style={{ width: '250px', height: '100%' }}>
            <div className="p-3 text-center border-bottom border-secondary">
                <h5>POS Nhà Hàng</h5>
                <small className="text-muted">Xin chào, {hoTen || 'Nhân viên'}</small>
            </div>

            <Nav className="flex-column flex-grow-1 p-2" variant="pills">
                {NAV_ITEMS.map(item => (
                    <SidebarNavItem key={item.to} to={item.to} icon={item.icon} label={item.label} />
                ))}
            </Nav>

            <div className="p-3 border-top border-secondary">
                <Nav.Link className="text-danger font-weight-bold" onClick={onLogout}>
                    🚪 Đăng xuất
                </Nav.Link>
            </div>
        </div>
    );
};

export default Sidebar;