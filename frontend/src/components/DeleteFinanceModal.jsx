import React from 'react';
import { AlertTriangle, Trash2, X, CircleDollarSign } from 'lucide-react';
import '../css/Modal.css';

const DeleteFinanceModal = ({ isOpen, onClose, onConfirm, financeToDelete, isDeleting }) => {
    if (!isOpen || !financeToDelete) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose} className="modal-close-btn" disabled={isDeleting}>
                    <X size={20} />
                </button>

                <div className="modal-icon-container">
                    <div className="modal-icon-background" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                        <CircleDollarSign size={32} color="#ef4444" />
                    </div>
                </div>

                <h2 className="modal-title">¿Eliminar Transacción?</h2>

                <p className="modal-message">
                    ¿Estás seguro de que deseas eliminar este registro de <strong>{financeToDelete.tipo}</strong>?
                </p>

                <div className="modal-warning-box">
                    <strong>Información del Movimiento:</strong>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem' }}>
                        Concepto: <strong>{financeToDelete.concepto}</strong><br />
                        Monto: <strong style={{ color: financeToDelete.tipo === 'ingreso' ? '#16a34a' : '#dc2626' }}>
                            ₡ {Number(financeToDelete.monto).toLocaleString('es-CR')}
                        </strong>
                    </p>
                </div>

                <p className="modal-sub-message">
                    Esta acción afectará directamente el balance general del Dashboard financiero.
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
                                Sí, Eliminar Registro
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteFinanceModal;
