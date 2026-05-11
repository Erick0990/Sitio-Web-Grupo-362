import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import '../css/Modal.css';

const DeleteScoutModal = ({ isOpen, onClose, onConfirm, scoutToDelete, isDeleting }) => {
    if (!isOpen || !scoutToDelete) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose} className="modal-close-btn" disabled={isDeleting}>
                    <X size={20} />
                </button>

                <div className="modal-icon-container">
                    <div className="modal-icon-background">
                        <AlertTriangle size={32} color="#dc3545" />
                    </div>
                </div>

                <h2 className="modal-title">¿Eliminar Scout?</h2>

                <p className="modal-message">
                    Estás a punto de eliminar a <strong>{scoutToDelete.nombre} {scoutToDelete.apellidos}</strong> ({scoutToDelete.cedula}).
                </p>

                <p className="modal-sub-message">
                    Esta acción es irreversible y el scout será dado de baja del sistema permanentemente.
                </p>

                <div className="modal-actions">
                    <button
                        onClick={onClose}
                        className="modal-cancel-btn"
                        disabled={isDeleting}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="modal-confirm-btn"
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Eliminando...' : (
                            <>
                                <Trash2 size={18} />
                                Sí, Eliminar
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteScoutModal;
