import React from 'react';
import { Nav } from 'react-bootstrap';
import SidebarNavItem from './SidebarNavItem';
import { useNotifications } from '../contexts/NotificationProvider';

const NAV_ITEMS = [
    {
        to: 'tables',
        label: 'Sơ đồ bàn ăn',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/></svg>
    },
    {
        to: 'menu',
        label: 'Menu gọi món',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16"><path d="M6.657 5.95l4.243-4.243a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121L9.485 8.778l3.182 3.182a1 1 0 0 1-1.414 1.414L8.07 10.193l-2.122 2.121a1 1 0 0 1-1.414-1.414l2.121-2.121-3.182-3.182a1 1 0 1 1 1.414-1.414L8.07 7.364l1.414-1.414zm-1.414 1.414l-3.182 3.182a1 1 0 1 0 1.414 1.414l3.182-3.182-1.414-1.414z"/><path d="M4.536 2.414l1.414 1.414-2.828 2.828-1.414-1.414 2.828-2.828z"/></svg>
    },
    {
        to: 'theodoi',
        label: 'Theo dõi món',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zM8.5 4.5a.5.5 0 0 0-1 0v3h-2a.5.5 0 0 0 0 1h2.5a.5.5 0 0 0 .5-.5v-3.5z"/></svg>
    },
];

const Sidebar = ({ hoTen, onLogout }) => {
    const { unreadCount } = useNotifications();

    return (
        <div
            className="d-flex flex-column"
            style={{
                width: '260px',
                height: '100%',
                backgroundColor: '#f4f1ea',
                borderRight: '1px solid #e2dcd0'
            }}
        >
            <div className="p-4 mb-2 text-center">
                <h5 className="fw-bold mb-1" style={{ color: '#2b5c38', letterSpacing: '0.5px' }}>
                    POS NHÀ HÀNG
                </h5>
                <small className="fw-semibold" style={{ color: '#888', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                    Xin chào, {hoTen || 'Nhân viên'}
                </small>
            </div>
            <Nav className="flex-column flex-grow-1 p-3" variant="pills">
                {NAV_ITEMS.map(item => (
                    <SidebarNavItem
                        key={item.to}
                        to={item.to}
                        icon={item.icon}
                        label={item.label}
                        showDot={item.to === 'theodoi' && unreadCount > 0}
                    />
                ))}
            </Nav>
            <div className="p-4">
                <Nav.Link
                    className="d-flex align-items-center px-3 py-2 fw-bold rounded-3"
                    onClick={onLogout}
                    style={{
                        color: '#d9534f',
                        gap: '14px',
                        fontSize: '0.95rem',
                        cursor: 'pointer'
                    }}
                >
                    <span className="d-flex align-items-center justify-content-center" style={{ width: '22px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                            <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                        </svg>
                    </span> Đăng xuất
                </Nav.Link>
            </div>
        </div>
    );
};

export default Sidebar;