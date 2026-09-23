import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const SidebarNavItem = ({ to, icon, label, showDot = false }) => {
    const location = useLocation();
    const isActive = location.pathname === to ||
        location.pathname.endsWith(`/${to}`) ||
        location.pathname.includes(`/${to}/`);

    return (
        <Nav.Link
            as={Link}
            to={to}
            className="sidebar-link"
            style={{
                backgroundColor: isActive ? '#2b5c38' : 'transparent',
                color: isActive ? '#ffffff' : '#5c5c5c',
                position: 'relative'
            }}
            title={label}
        >
            <span className="d-flex align-items-center justify-content-center" style={{ width: '22px', position: 'relative', flexShrink: 0 }}>
                {icon}
                {showDot && (
                    <span
                        style={{
                            position: 'absolute',
                            top: '-2px',
                            right: '-2px',
                            width: '9px',
                            height: '9px',
                            backgroundColor: '#dc3545',
                            borderRadius: '50%',
                            border: '2px solid #f4f1ea'
                        }}
                    />
                )}
            </span>
            <span className="sidebar-link-text">{label}</span>
        </Nav.Link>
    );
};

export default SidebarNavItem;