import React from 'react';
import { Nav } from 'react-bootstrap';
// Import chung SidebarNavItem với giao diện phục vụ
import SidebarNavItem from './SidebarNavItem';

const NAV_ITEMS = [
    {
        to: '/thu-ngan/thanh-toan',
        label: 'Thanh toán',
        // Icon Cash Coin
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0z"/><path d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.046-.639-.27-.696-.563h-.669zM3 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5h-1V2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h3v1H5a2 2 0 0 1-2-2V2z"/><path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>
    },
    {
        to: '/thu-ngan/lich-su',
        label: 'Lịch sử',
        // Icon Clock History
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-1.728 1.637a7.002 7.002 0 0 0 1.054-.53l.534.846a8.003 8.003 0 0 1-1.205.606l-.383-.922zm-2.19.824c.28-.066.554-.15.82-.25l.286.958a7.994 7.994 0 0 1-1.042.316l-.064-.997a6.994 6.994 0 0 0 .824-.25z"/><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3.5a.5.5 0 0 1-.5-.5v-4A.5.5 0 0 1 8 4z"/></svg>
    }
];

const SidebarThuNgan = ({ hoTen, onLogout }) => {
    return (
        <div
            className="d-flex flex-column"
            style={{
                width: '260px',
                height: '100%',
                backgroundColor: '#f4f1ea', // Cùng màu nền với phục vụ
                borderRight: '1px solid #e2dcd0'
            }}
        >
            <div className="p-4 mb-2 text-center">
                <h5 className="fw-bold mb-1" style={{ color: '#2b5c38', letterSpacing: '0.5px' }}>
                    POS NHÀ HÀNG
                </h5>
                <small className="fw-semibold" style={{ color: '#888', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                    Xin chào, {hoTen || 'Thu Ngân'}
                </small>
            </div>

            <Nav className="flex-column flex-grow-1 p-3" variant="pills">
                {NAV_ITEMS.map(item => (
                    <SidebarNavItem
                        key={item.to}
                        to={item.to}
                        icon={item.icon}
                        label={item.label}
                        showDot={false} // Thu ngân không dùng badge
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

export default SidebarThuNgan;