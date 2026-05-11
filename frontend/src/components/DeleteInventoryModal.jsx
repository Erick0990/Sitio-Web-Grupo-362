import React from 'react';
import { AlertTriangle, Trash2, X, Package } from 'lucide-react';
import '../css/Modal.css';

const DeleteInventoryModal = ({ isOpen, onClose, onConfirm, itemToDelete, isDeleting }) => {
    if (!isOpen || !itemToDelete) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose} className="modal-close-btn" disabled={isDeleting}>
                    <X size={20} />
                </button>

                <div className="modal-icon-container">
                    <div className="modal-icon-background" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                        <Package size={32} color="#ef4444" />
                    </div>
                </div>

                <h2 className="modal-title">¿Eliminar del Inventario?</h2>

                <p className="modal-message">
                    Estás a punto de eliminar <strong>{itemToDelete.nombre}</strong>.
                </p>

                <div className="modal-warning-box">
                    <strong>Información del Ítem:</strong>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem' }}>
                        Cantidad actual: <strong>{itemToDelete.cantidad}</strong> unidades.<br />
                        Estado: <strong>{itemToDelete.estado}</strong>
                    </p>
                </div>

                <p className="modal-sub-message">
                    Esta acción es irreversible y el registro de este equipo desaparecerá de la base de datos.
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
                        style={{ backgroundColor: '#ef4444' }}
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

export default DeleteInventoryModal;
