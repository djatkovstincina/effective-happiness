import React from "react";

import { ConfirmationModalProps } from "../../types/ModalTypes"

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, message }) => {

    if (!isOpen) {
        return null;
    }

    return (

        <div className="fixed top-0 left-0 w-full h-full bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg text-center max-w-sm">
                <p className="mb-6">{message}</p>
                <button
                    className="mr-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={onConfirm}
                    type="button"
                >
                    Confirm
                </button>
                <button
                    className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    onClick={onClose}
                    type="button"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default ConfirmationModal;
