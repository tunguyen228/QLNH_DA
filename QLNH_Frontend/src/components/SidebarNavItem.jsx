import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const SidebarNavItem = ({ to, icon, label }) => {
    const location = useLocation();
    const isActive = location.pathname.startsWith(`/dashboard/${to}`);

    return (
        <Nav.Link
            as={Link}
            to={to}
            className={`text-white mb-2 ${isActive ? 'bg-primary' : ''}`}
        >
            {icon} {label}
        </Nav.Link>
    );
};

export default SidebarNavItem;