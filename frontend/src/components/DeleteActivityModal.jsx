import React from 'react';
import { AlertTriangle, Trash2, X, CalendarDays } from 'lucide-react';
import '../css/Modal.css';

const DeleteActivityModal = ({ isOpen, onClose, onConfirm, activityToDelete, isDeleting }) => {
    if (!isOpen || !activityToDelete) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose} className="modal-close-btn" disabled={isDeleting}>
                    <X size={20} />
                </button>

                <div className="modal-icon-container">
                    <div className="modal-icon-background" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                        <CalendarDays size={32} color="#ef4444" />
                    </div>
                </div>

                <h2 className="modal-title">¿Eliminar Actividad?</h2>

                <p className="modal-message">
                    Estás a punto de cancelar y eliminar definitivamente la actividad: <strong>{activityToDelete.titulo}</strong>.
                </p>

                <div className="modal-warning-box">
                    <strong>Detalles del Evento:</strong>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem' }}>
                        Fecha: <strong>{new Date(activityToDelete.fecha_inicio).toLocaleDateString()}</strong><br />
                        Lugar: <strong>{activityToDelete.lugar}</strong>
                    </p>
                </div>

                <p className="modal-sub-message">
                    Al eliminarla, se borrarán también todos los registros de asistencia asociados a este evento.
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
                                Sí, Eliminar Actividad
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteActivityModal;
