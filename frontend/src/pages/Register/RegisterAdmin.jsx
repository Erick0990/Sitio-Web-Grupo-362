import { useState } from 'react';
import { registerAdmin } from '../../services/apiRegister';
import '../../css/register.css';

export default function RegisterAdmin() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const initialFormState = {
        cedula: '', nombre: '', apellidos: '', fechaNac: '', email: '', password: '', numero: ''
    };
    const [formData, setFormData] = useState(initialFormState);

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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (formData.cedula.length < 9) e.cedula = 'Cédula debe tener 9 dígitos';
        if (!formData.nombre.trim()) e.nombre = 'Nombre obligatorio';
        if (!formData.apellidos.trim()) e.apellidos = 'Apellidos obligatorios';
        if (!dateRegex.test(formData.fechaNac)) e.fechaNac = 'Formato DD/MM/AAAA inválido';
        if (formData.numero.length < 8) e.numero = 'Teléfono debe tener 8 dígitos';
        if (!emailRegex.test(formData.email)) e.email = 'Email inválido';
        if (formData.password.length < 6) e.password = 'Mínimo 6 caracteres';

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const payload = {
                cedula: formData.cedula,
                nombre: formData.nombre,
                apellidos: formData.apellidos,
                email: formData.email,
                password: formData.password,
                telefono: formData.numero,
                fecha_nacimiento: formatToSQLDate(formData.fechaNac)
            };

            await registerAdmin(payload);
            alert('¡Administrador registrado exitosamente!');
            setFormData(initialFormState);
        } catch (error) {
            alert(error.error || 'Ocurrió un error en el registro');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-card embedded" style={{ boxShadow: 'none', padding: '1rem', width: '100%' }}>
            <h1 className="register-title">Registro de Administrador</h1>
            <p className="register-subtitle">Datos de la nueva cuenta admin</p>

            <form className="register-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Cédula</label>
                    <input type="text" value={formData.cedula} onChange={(e) => handleDigitsOnly('cedula', e.target.value, 9)} placeholder="9 dígitos" />
                    {errors.cedula && <span className="field-error">{errors.cedula}</span>}
                </div>

                <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" value={formData.nombre} onChange={(e) => handleLettersOnly('nombre', e.target.value)} />
                    {errors.nombre && <span className="field-error">{errors.nombre}</span>}
                </div>

                <div className="form-group">
                    <label>Apellidos</label>
                    <input type="text" value={formData.apellidos} onChange={(e) => handleLettersOnly('apellidos', e.target.value)} />
                    {errors.apellidos && <span className="field-error">{errors.apellidos}</span>}
                </div>

                <div className="form-group">
                    <label>Fecha de Nacimiento</label>
                    <input type="text" value={formData.fechaNac} onChange={(e) => handleDateMask('fechaNac', e.target.value)} placeholder="DD/MM/AAAA" />
                    {errors.fechaNac && <span className="field-error">{errors.fechaNac}</span>}
                </div>

                <div className="form-group">
                    <label>Teléfono</label>
                    <input type="tel" value={formData.numero} onChange={(e) => handleDigitsOnly('numero', e.target.value, 8)} placeholder="8 dígitos" />
                    {errors.numero && <span className="field-error">{errors.numero}</span>}
                </div>

                <hr className="divider" />

                <div className="form-group">
                    <label>Correo Electrónico</label>
                    <input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label>Contraseña</label>
                    <input type="password" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} />
                    {errors.password && <span className="field-error">{errors.password}</span>}
                </div>

                <button type="submit" className="register-submit" disabled={loading}>
                    {loading ? 'Procesando...' : 'Crear Administrador'}
                </button>
            </form>
        </div>
    );
}
