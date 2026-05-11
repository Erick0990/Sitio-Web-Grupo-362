import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import '../css/Modal.css';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, userToDelete, isDeleting }) => {
    if (!isOpen || !userToDelete) return null;

    const isEncargado = userToDelete.rol === 'encargado';

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

                <h2 className="modal-title">¿Eliminar Usuario?</h2>

                <p className="modal-message">
                    Estás a punto de eliminar a <strong>{userToDelete.nombre} {userToDelete.apellidos}</strong> ({userToDelete.cedula}).
                </p>

                {isEncargado ? (
                    <div className="modal-warning-box">
                        <strong>¡ADVERTENCIA CRÍTICA!</strong>
                        <p style={{ margin: '5px 0 0 0' }}>
                            Este usuario es un <strong>Encargado</strong>. Si lo eliminas, <strong>TODOS LOS SCOUTS</strong> asociados a este encargado también serán eliminados permanentemente del sistema debido a la eliminación en cascada.
                        </p>
                    </div>
                ) : (
                    <p className="modal-sub-message">
                        Esta acción es irreversible y los datos no podrán recuperarse.
                    </p>
                )}

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

export default DeleteConfirmModal;
