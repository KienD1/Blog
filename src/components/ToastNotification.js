import React, { useEffect } from 'react';
import '../styles/ToastNotification.css';

const ToastNotification = ({ message, type, show, onClose }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 1500); 

            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    return (
        <div
            className={`toast position-fixed top-0 end-0 m-3 ${show ? 'show' : ''}`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            style={{
                zIndex: 1050,
                minWidth: '300px',
                fontSize: '1.2rem',
                animation: `${show ? 'slideIn' : 'slideOut'} 0.5s ease`, 
                transform: show ? 'translateX(0)' : 'translateX(100%)',
            }}
        >
            <div
                className={`toast-header text-white`}
                style={{
                    backgroundColor: type === 'success' ? '#28a745' : '#dc3545',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                }}
            >
                <strong className="me-auto">{type === 'success' ? 'Success' : 'Error'}</strong>
                <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={onClose}
                    aria-label="Close"
                ></button>
            </div>
            <div className="toast-body" style={{ padding: '1.25rem', fontSize: '1.1rem' }}>
                {message}
            </div>
        </div>
    );
};

export default ToastNotification;
