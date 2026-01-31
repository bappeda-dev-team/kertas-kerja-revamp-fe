"use client"
import React from "react";

interface modal {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string; 
}

const Modal: React.FC<modal> = ({isOpen, onClose, children, className}) => {
    if(!isOpen){
        return null;
    } else {

    return(
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
            <div className={`bg-white rounded-lg p-8 z-10 ${className}`}>
                {children}
            </div>
        </div>
    );
    }
}

export default Modal;