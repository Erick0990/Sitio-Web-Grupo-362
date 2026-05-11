import React, { useState, useEffect } from 'react';
import { Edit, Save } from 'lucide-react';
import '../css/Modal.css';

const EditActivityModal = ({ isOpen, onClose, onSave, activityToEdit, isSaving }) => {
    const [formData, setFormData] = useState({
        titulo: '', descripcion: '', fecha_inicio: '', fecha_fin: '', lugar: '', costo: '', tipo: 'Reunión'
    });

    useEffect(() => {
        if (activityToEdit && isOpen) {
            setFormData({
                titulo: activityToEdit.titulo || '',
                descripcion: activityToEdit.descripcion || '',
                fecha_inicio: activityToEdit.fecha_inicio ? activityToEdit.fecha_inicio.split('T')[0] : '',
                fecha_fin: activityToEdit.fecha_fin ? activityToEdit.fecha_fin.split('T')[0] : '',
                lugar: activityToEdit.lugar || '',
                costo: activityToEdit.costo || '0',
                tipo: activityToEdit.tipo || 'Reunión'
            });
        }
    }, [activityToEdit, isOpen]);

    const today = new Date().toISOString().split('T')[0];

    if (!isOpen || !activityToEdit) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.fecha_inicio < today) {
            alert("No se pueden programar actividades en fechas pasadas.");
            return;
        }

        if (formData.fecha_fin < formData.fecha_inicio) {
            alert("La fecha de fin no puede ser anterior a la fecha de inicio.");
            return;
        }

        onSave(activityToEdit.id, formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '600px' }}>
                <div className="modal-icon-container">
                    <div className="modal-icon-background" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)' }}>
                        <Edit size={32} color="#3b82f6" />
                    </div>
                </div>

                <h2 className="modal-title">Editar Actividad</h2>
                <p className="modal-message" style={{ marginBottom: '1.5rem' }}>
                    Actualiza la información del evento.
                </p>

                <form onSubmit={handleSubmit} style={{ width: '100%', textAlign: 'left' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="modal-form-label">Título</label>
                        <input type="text" required value={formData.titulo} onChange={(e) => setFormData({ ...formData, titulo: e.target.value })} className="modal-form-input" />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label className="modal-form-label">Tipo de Actividad</label>
                            <select value={formData.tipo} onChange={(e) => setFormData({ ...formData, tipo: e.target.value })} className="modal-form-input">
                                <option value="Reunión">Reunión</option>
                                <option value="Campamento">Campamento</option>
                                <option value="Excursión">Excursión</option>
                                <option value="Servicio">Servicio</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="modal-form-label">Costo (₡)</label>
                            <input
                                type="text"
                                value={formData.costo ? `₡ ${Number(formData.costo).toLocaleString('es-CR')}` : ''}
                                onChange={(e) => {
                                    const rawValue = e.target.value.replace(/\D/g, '');
                                    setFormData({ ...formData, costo: rawValue });
                                }}
                                className="modal-form-input"
                                placeholder="₡ 0"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label className="modal-form-label">Fecha Inicio</label>
                            <input 
                                type="date" 
                                required 
                                min={today}
                                value={formData.fecha_inicio} 
                                onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })} 
                                className="modal-form-input" 
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="modal-form-label">Fecha Fin</label>
                            <input 
                                type="date" 
                                required 
                                min={formData.fecha_inicio || today}
                                value={formData.fecha_fin} 
                                onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })} 
                                className="modal-form-input" 
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label className="modal-form-label">Lugar</label>
                        <input type="text" value={formData.lugar} onChange={(e) => setFormData({ ...formData, lugar: e.target.value })} className="modal-form-input" />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label className="modal-form-label">Descripción</label>
                        <textarea
                            value={formData.descripcion}
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                            className="modal-form-input"
                            rows="3"
                            style={{ resize: 'vertical' }}
                        ></textarea>
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="modal-cancel-btn" disabled={isSaving}>
                            Cancelar
                        </button>
                        <button type="submit" className="modal-confirm-btn" style={{ backgroundColor: '#3b82f6' }} disabled={isSaving}>
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
};

export default EditActivityModal;
