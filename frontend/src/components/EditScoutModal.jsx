import React, { useState, useEffect } from 'react';
import { Edit, X, Save } from 'lucide-react';
import '../css/Modal.css';

const EditScoutModal = ({ isOpen, onClose, onSave, scoutToEdit, isSaving }) => {
    const [formData, setFormData] = useState({
        nombre: '', apellidos: '', fechaNac: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (scoutToEdit && isOpen) {
            let formattedDate = '';
            if (scoutToEdit.fecha_nacimiento) {
                const dateObj = new Date(scoutToEdit.fecha_nacimiento);
                const day = String(dateObj.getUTCDate()).padStart(2, '0');
                const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
                const year = dateObj.getUTCFullYear();
                formattedDate = `${day}/${month}/${year}`;
            }

            setFormData({
                nombre: scoutToEdit.nombre || '',
                apellidos: scoutToEdit.apellidos || '',
                fechaNac: formattedDate
            });
            setErrors({});
        }
    }, [scoutToEdit, isOpen]);

    if (!isOpen || !scoutToEdit) return null;

    const formatToSQLDate = (dateString) => {
        if (!dateString || !dateString.includes('/')) return '';
        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleDigitsOnly = (field, val, max) => {
        const cleanVal = val.replace(/\D/g, '').slice(0, max);
        handleInputChange(field, cleanVal);
    };

    const handleLettersOnly = (field, val) => {
        const cleanVal = val.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
        handleInputChange(field, cleanVal);
    };

    const handleDateMask = (field, val) => {
        let clean = val.replace(/\D/g, '');
        if (clean.length > 2) clean = clean.slice(0, 2) + '/' + clean.slice(2);
        if (clean.length > 5) clean = clean.slice(0, 5) + '/' + clean.slice(5, 9);
        handleInputChange(field, clean);
    };

    const validateForm = () => {
        const e = {};
        const dateRegex = /^([0-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/;

        if (!formData.nombre.trim()) e.nombre = 'Nombre obligatorio';
        if (!formData.apellidos.trim()) e.apellidos = 'Apellidos obligatorios';
        if (!dateRegex.test(formData.fechaNac)) e.fechaNac = 'Formato DD/MM/AAAA inválido';

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = {
            nombre: formData.nombre,
            apellidos: formData.apellidos,
            fecha_nacimiento: formatToSQLDate(formData.fechaNac),
            cedula_encargado: scoutToEdit.cedula_encargado // Mantenemos el mismo encargado
        };

        onSave(scoutToEdit.cedula, payload);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '600px' }}>
                <button onClick={onClose} className="modal-close-btn" disabled={isSaving}>
                    <X size={20} />
                </button>

                <div className="modal-icon-container">
                    <div className="modal-icon-background" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
                        <Edit size={32} color="#3b82f6" />
                    </div>
                </div>

                <h2 className="modal-title">Editar Scout</h2>
                <p className="modal-message" style={{ marginBottom: '1.5rem' }}>
                    Actualiza los datos del scout.
                </p>

                <form onSubmit={handleSubmit} style={{ width: '100%', textAlign: 'left' }}>
                    
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label className="modal-form-label">Cédula del Scout (No editable)</label>
                            <input type="text" value={scoutToEdit.cedula} disabled className="modal-form-input" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="modal-form-label">Edad actual</label>
                            <input type="text" value={`${scoutToEdit.edad} años`} disabled className="modal-form-input" />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label className="modal-form-label">Cédula Encargado (No editable)</label>
                            <input type="text" value={scoutToEdit.cedula_encargado} disabled className="modal-form-input" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="modal-form-label">Nombre Encargado</label>
                            <input type="text" value={scoutToEdit.nombre_encargado} disabled className="modal-form-input" />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label className="modal-form-label">Nombre del Scout</label>
                            <input type="text" value={formData.nombre} onChange={(e) => handleLettersOnly('nombre', e.target.value)} className="modal-form-input" />
                            {errors.nombre && <span className="modal-form-error">{errors.nombre}</span>}
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="modal-form-label">Apellidos del Scout</label>
                            <input type="text" value={formData.apellidos} onChange={(e) => handleLettersOnly('apellidos', e.target.value)} className="modal-form-input" />
                            {errors.apellidos && <span className="modal-form-error">{errors.apellidos}</span>}
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label className="modal-form-label">Fecha de Nacimiento</label>
                        <input type="text" value={formData.fechaNac} onChange={(e) => handleDateMask('fechaNac', e.target.value)} placeholder="DD/MM/AAAA" className="modal-form-input" />
                        {errors.fechaNac && <span className="modal-form-error">{errors.fechaNac}</span>}
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

export default EditScoutModal;
