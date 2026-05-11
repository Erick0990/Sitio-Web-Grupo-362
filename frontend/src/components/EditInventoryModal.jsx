import React, { useState, useEffect } from 'react';
import { Save, X, Package, Edit } from 'lucide-react';
import '../css/Modal.css';

export default function EditInventoryModal({ isOpen, onClose, onSave, itemToEdit, isSaving }) {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        cantidad: 0,
        estado: 'Bueno'
    });

    useEffect(() => {
        if (itemToEdit && isOpen) {
            setFormData({
                nombre: itemToEdit.nombre || '',
                descripcion: itemToEdit.descripcion || '',
                cantidad: itemToEdit.cantidad || 0,
                estado: itemToEdit.estado || 'Bueno'
            });
        }
    }, [itemToEdit, isOpen]);

    if (!isOpen || !itemToEdit) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(itemToEdit.id, formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '500px' }}>
                <button onClick={onClose} className="modal-close-btn" disabled={isSaving}>
                    <X size={20} />
                </button>

                <div className="modal-icon-container">
                    <div className="modal-icon-background" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                        <Edit size={32} color="#3b82f6" />
                    </div>
                </div>

                <h2 className="modal-title">Editar Ítem</h2>
                <p className="modal-message" style={{ marginBottom: '1.5rem' }}>
                    Modifica los detalles del equipo en inventario.
                </p>

                <form onSubmit={handleSubmit} style={{ width: '100%', textAlign: 'left' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="modal-form-label">Nombre del Ítem</label>
                        <input
                            type="text"
                            required
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            className="modal-form-input"
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label className="modal-form-label">Descripción</label>
                        <textarea
                            value={formData.descripcion}
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                            className="modal-form-input"
                            rows="3"
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ flex: 1 }}>
                            <label className="modal-form-label">Cantidad</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.cantidad}
                                onChange={(e) => setFormData({ ...formData, cantidad: parseInt(e.target.value) || 0 })}
                                className="modal-form-input"
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="modal-form-label">Estado</label>
                            <select
                                value={formData.estado}
                                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                className="modal-form-input"
                            >
                                <option value="Nuevo">Nuevo</option>
                                <option value="Bueno">Bueno</option>
                                <option value="Regular">Regular</option>
                                <option value="Malo">Malo</option>
                            </select>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="modal-cancel-btn" disabled={isSaving}>
                            Cancelar
                        </button>
                        <button type="submit" className="modal-confirm-btn" disabled={isSaving}>
                            {isSaving ? 'Guardando...' : (
                                <>
                                    <Save size={18} />
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
