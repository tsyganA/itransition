import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        const handleClickOutside = event => {
            if (event.target.className === 'modal') {
                onClose();
            }
        };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal">
            {/* <div className="modal-content"> */}
            {/* <button onClick={onClose}>Close</button> */}
            {children}
            {/* </div> */}
        </div>
    );
};

export default Modal;
