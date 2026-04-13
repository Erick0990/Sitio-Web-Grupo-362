import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUserAndScout } from '../../services/apiRegister';
import './register.css';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Encargado, 2: Scout
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // --- ESTADO ÚNICO PARA TODO EL FORMULARIO ---
    const [formData, setFormData] = useState({
        // Datos Encargado
        cedula: '',
        nombre: '',
        apellidos: '',
        fechaNac: '',
        email: '',
        password: '',
        numero: '',
        // Datos Scout
        scout_cedula: '',
        scout_nombre: '',
        scout_apellidos: '',
        scout_fechaNac: ''
    });

    // --- FORMATEADORES Y HELPERS ---
    const formatToSQLDate = (dateString) => {
        if (!dateString || !dateString.includes('/')) return '';
        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    // --- MANEJADORES DE ENTRADA ESPECÍFICOS ---
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

    // --- VALIDACIONES POR PASO ---
    const validateStep1 = () => {
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

    const validateStep2 = () => {
        const e = {};
        const dateRegex = /^([0-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/;

        if (formData.scout_cedula.length < 9) e.scout_cedula = 'Cédula debe tener 9 dígitos';
        if (!formData.scout_nombre.trim()) e.scout_nombre = 'Nombre obligatorio';
        if (!formData.scout_apellidos.trim()) e.scout_apellidos = 'Apellidos obligatorios';
        if (!dateRegex.test(formData.scout_fechaNac)) e.scout_fechaNac = 'Formato DD/MM/AAAA inválido';

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // --- ENVÍO FINAL ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep2()) return;

        setLoading(true);
        try {
            const payload = {
                cedula: formData.cedula,
                nombre: formData.nombre,
                apellidos: formData.apellidos,
                email: formData.email,
                password: formData.password,
                telefono: formData.numero,
                fecha_nacimiento: formatToSQLDate(formData.fechaNac),
                scout_cedula: formData.scout_cedula,
                scout_nombre: formData.scout_nombre,
                scout_apellidos: formData.scout_apellidos,
                scout_fecha_nacimiento: formatToSQLDate(formData.scout_fechaNac)
            };

            const response = await registerUserAndScout(payload);
            alert('¡Registro exitoso! Bienvenido al Grupo 362.');
            if (response.token) localStorage.setItem('token', response.token);
            navigate('/login');
        } catch (error) {
            alert(error.error || 'Ocurrió un error en el registro');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                {/* Botón Volver */}
                <button
                    className="back-link"
                    onClick={() => step === 1 ? navigate('/login') : setStep(1)}
                    disabled={loading}
                >
                    {step === 1 ? '← Volver al Login' : '← Volver al Paso 1'}
                </button>

                <h1 className="register-title">
                    {step === 1 ? 'Registro de Encargados' : 'Información del Scout'}
                </h1>
                <p className="register-subtitle">Paso {step} de 2</p>

                <form className="register-form" onSubmit={step === 1 ? (e) => { e.preventDefault(); if (validateStep1()) setStep(2); } : handleSubmit}>

                    {step === 1 ? (
                        /* --- VISTA PASO 1: ENCARGADO --- */
                        <>
                            <div className="form-group">
                                <label>Cédula del Encargado</label>
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

                            <button type="submit" className="register-submit">Siguiente</button>
                        </>
                    ) : (
                        /* --- VISTA PASO 2: SCOUT --- */
                        <>
                            <div className="form-group">
                                <label>Cédula del Scout</label>
                                <input type="text" value={formData.scout_cedula} onChange={(e) => handleDigitsOnly('scout_cedula', e.target.value, 9)} placeholder="9 dígitos" />
                                {errors.scout_cedula && <span className="field-error">{errors.scout_cedula}</span>}
                            </div>

                            <div className="form-group">
                                <label>Nombre del Scout</label>
                                <input type="text" value={formData.scout_nombre} onChange={(e) => handleLettersOnly('scout_nombre', e.target.value)} />
                                {errors.scout_nombre && <span className="field-error">{errors.scout_nombre}</span>}
                            </div>

                            <div className="form-group">
                                <label>Apellidos del Scout</label>
                                <input type="text" value={formData.scout_apellidos} onChange={(e) => handleLettersOnly('scout_apellidos', e.target.value)} />
                                {errors.scout_apellidos && <span className="field-error">{errors.scout_apellidos}</span>}
                            </div>

                            <div className="form-group">
                                <label>Fecha de Nacimiento del Scout</label>
                                <input type="text" value={formData.scout_fechaNac} onChange={(e) => handleDateMask('scout_fechaNac', e.target.value)} placeholder="DD/MM/AAAA" />
                                {errors.scout_fechaNac && <span className="field-error">{errors.scout_fechaNac}</span>}
                            </div>

                            <button type="submit" className="register-submit" disabled={loading}>
                                {loading ? 'Procesando...' : 'Completar Registro'}
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}