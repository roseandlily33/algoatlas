import React from "react";
import styles from "./cheatSheetModal.module.css";

const CheatSheetModal = ({ open, onClose, title, children }) => {
    if (!open) return null;
    return (
        <div className={styles.overlay} onClick={onClose}>
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
                tabIndex={-1}
            >
                <button className={styles.closeBtn} onClick={onClose}>
                    ×
                </button>
                <div className={styles.title}>{title}</div>
                <div
                    className={styles.content}
                    style={{
                        minHeight: '100px',
                        minWidth: '200px',
                        maxHeight: '60vh',
                        overflowY: 'auto',
                        color: '#222',
                        zIndex: 9999,
                        position: 'relative',
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CheatSheetModal;
