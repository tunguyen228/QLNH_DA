import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const SidebarNavItem = ({ to, icon, label, showDot = false }) => {
    const location = useLocation();
    const isActive = location.pathname.includes(to);

    return (
        <Nav.Link
            as={Link}
            to={to}
            className={`d-flex align-items-center mb-2 px-3 py-2 fw-bold rounded-3`}
            style={{
                backgroundColor: isActive ? '#2b5c38' : 'transparent',
                color: isActive ? '#ffffff' : '#5c5c5c',
                transition: 'all 0.2s ease-in-out',
                gap: '14px',
                fontSize: '0.95rem',
                position: 'relative'
            }}
        >
            <span className="d-flex align-items-center justify-content-center" style={{ width: '22px', position: 'relative' }}>
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
            {label}
        </Nav.Link>
    );
};

export default SidebarNavItem;