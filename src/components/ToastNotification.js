import React, { useEffect } from 'react';

const ToastNotification = ({ message, type, show, onClose }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000); 

            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    return (
        <div
            className={`toast position-fixed top-0 end-0 m-3 ${show ? 'show' : ''}`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            style={{ zIndex: 1050 }}
        >
            <div className={`toast-header ${type === 'success' ? 'bg-success' : 'bg-danger'} text-white`}>
                <strong className="me-auto">{type === 'success' ? 'Success' : 'Error'}</strong>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="toast-body">
                {message}
            </div>
        </div>
    );
};

export default ToastNotification;
