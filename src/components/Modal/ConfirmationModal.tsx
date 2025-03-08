import React from "react";

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    message,
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    textAlign: "center",
                }}
            >
                <p style={{ marginBottom: "24px" }}>{message}</p>
                <button
                    onClick={onConfirm}
                    style={{ marginRight: "10px", padding: "8px" }}
                    type="button"
                >
                    Confirm
                </button>
                <button
                    onClick={onClose}
                    style={{ padding: "8px" }}
                    type="button"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default ConfirmationModal;
