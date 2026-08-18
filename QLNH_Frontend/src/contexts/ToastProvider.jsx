import React, { createContext, useContext, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    
    const addToast = (message, variant = 'success') => {
        const id = new Date().getTime();
        setToasts((prevToasts) => [...prevToasts, { id, message, variant }]);
    };

    const removeToast = (id) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <ToastContainer position="top-end" className="p-3" style={{ position: 'fixed', zIndex: 9999 }}>
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        onClose={() => removeToast(toast.id)}
                        delay={3000}
                        autohide
                        bg={toast.variant}
                    >
                        <Toast.Header>
                            <strong className="me-auto">
                                {toast.variant === 'success' ? 'Thành công' : 'Thông báo'}
                            </strong>
                        </Toast.Header>
                        <Toast.Body className={toast.variant === 'success' || toast.variant === 'danger' ? 'text-white' : ''}>
                            {toast.message}
                        </Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>
        </ToastContext.Provider>
    );
};