import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Tent, CircleDollarSign, CalendarDays, ClipboardCheck, LogOut, Activity, Clock, PlusCircle, ShieldAlert } from 'lucide-react';
import RegisterPage from '../Register/RegisterPage';
import RegisterAdmin from '../Register/RegisterAdmin';
import '../../css/adminDashboard.css';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('inicio');
    const [registerType, setRegisterType] = useState('none'); // 'none', 'admin'

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!token || !storedUser) {
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.rol !== 'administrador') {
            navigate('/');
            return;
        }

        setUser(parsedUser);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-primary)' }}>
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <h2 className="sidebar-title">Admin 362</h2>
                </div>

                <nav className="sidebar-nav">
                    <a className={`nav-item ${activeTab === 'inicio' ? 'active' : ''}`} onClick={() => setActiveTab('inicio')}>
                        <span className="nav-icon"><LayoutDashboard size={20} /></span>
                        Resumen General
                    </a>
                    <a className={`nav-item ${activeTab === 'usuarios' ? 'active' : ''}`} onClick={() => { setActiveTab('usuarios'); setShowRegisterForm(false); }}>
                        <span className="nav-icon"><Users size={20} /></span>
                        Gestión de Usuarios
                    </a>
                    <a className={`nav-item ${activeTab === 'scouts' ? 'active' : ''}`} onClick={() => setActiveTab('scouts')}>
                        <span className="nav-icon"><Tent size={20} /></span>
                        Registro de Scouts
                    </a>
                    <a className={`nav-item ${activeTab === 'finanzas' ? 'active' : ''}`} onClick={() => setActiveTab('finanzas')}>
                        <span className="nav-icon"><CircleDollarSign size={20} /></span>
                        Finanzas y Pagos
                    </a>
                    <a className={`nav-item ${activeTab === 'actividades' ? 'active' : ''}`} onClick={() => setActiveTab('actividades')}>
                        <span className="nav-icon"><CalendarDays size={20} /></span>
                        Actividades
                    </a>
                    <a className={`nav-item ${activeTab === 'asistencias' ? 'active' : ''}`} onClick={() => setActiveTab('asistencias')}>
                        <span className="nav-icon"><ClipboardCheck size={20} /></span>
                        Control de Asistencia
                    </a>
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={18} /> Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                {/* Topbar */}
                <header className="admin-topbar">
                    <h1 className="topbar-title">
                        {activeTab === 'inicio' && 'Resumen del Sistema'}
                        {activeTab === 'usuarios' && 'Gestión de Encargados y Administradores'}
                        {activeTab === 'scouts' && 'Directorio de Scouts'}
                        {activeTab === 'finanzas' && 'Control de Ingresos y Gastos'}
                        {activeTab === 'actividades' && 'Calendario de Actividades'}
                        {activeTab === 'asistencias' && 'Asistencias por Evento'}
                    </h1>

                    <div className="topbar-user">
                        <div className="user-info">
                            <p className="user-name">{user.nombre} {user.apellidos}</p>
                            <p className="user-role">{user.rol}</p>
                        </div>
                        <div className="user-avatar">
                            {user.nombre.charAt(0)}{user.apellidos.charAt(0)}
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="admin-content">
                    {activeTab === 'inicio' && (
                        <>
                            <div className="dashboard-grid">
                                <div className="stat-card primary">
                                    <div className="stat-info">
                                        <h3 className="stat-title">Total Usuarios</h3>
                                        <p className="stat-value">124</p>
                                    </div>
                                    <div className="stat-icon"><Users size={28} /></div>
                                </div>

                                <div className="stat-card primary">
                                    <div className="stat-info">
                                        <h3 className="stat-title">Scouts Activos</h3>
                                        <p className="stat-value">85</p>
                                    </div>
                                    <div className="stat-icon"><Tent size={28} /></div>
                                </div>

                                <div className="stat-card secondary">
                                    <div className="stat-info">
                                        <h3 className="stat-title">Asistencia Mes</h3>
                                        <p className="stat-value">92%</p>
                                    </div>
                                    <div className="stat-icon"><Activity size={28} /></div>
                                </div>

                                <div className="stat-card primary">
                                    <div className="stat-info">
                                        <h3 className="stat-title">Próxima Actividad</h3>
                                        <p className="stat-value">2 Días</p>
                                    </div>
                                    <div className="stat-icon"><Clock size={28} /></div>
                                </div>
                            </div>

                            <div className="content-section">
                                <div className="section-header">
                                    <h2 className="section-title">Actividad Reciente</h2>
                                    <button className="btn-outline">Ver todo</button>
                                </div>
                                <div className="activity-list">
                                    <div className="activity-item">
                                        <div className="activity-icon"><Users size={20} color="var(--color-primary)" /></div>
                                        <div className="activity-details">
                                            <p className="activity-text">Nuevo scout registrado: <strong>Carlos Alvarado</strong></p>
                                            <p className="activity-time">Hace 2 horas</p>
                                        </div>
                                    </div>
                                    <div className="activity-item">
                                        <div className="activity-icon"><CircleDollarSign size={20} color="var(--color-secondary)" /></div>
                                        <div className="activity-details">
                                            <p className="activity-text">Pago de mensualidad confirmado para <strong>Patrulla Lobos</strong></p>
                                            <p className="activity-time">Ayer, 15:30</p>
                                        </div>
                                    </div>
                                    <div className="activity-item">
                                        <div className="activity-icon"><CalendarDays size={20} color="var(--color-accent)" /></div>
                                        <div className="activity-details">
                                            <p className="activity-text">Nueva actividad programada: <strong>Campamento de Verano</strong></p>
                                            <p className="activity-time">Hace 2 días</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'usuarios' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {/* Panel de Acciones */}
                            <div className="content-section" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h2 className="section-title">Usuarios Registrados</h2>
                                    <p style={{ color: 'var(--color-text)', opacity: 0.7, margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                                        Administra los encargados y sus cuentas.
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button 
                                        className="btn-outline" 
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: registerType === 'admin' ? 'var(--color-primary)' : 'transparent', color: registerType === 'admin' ? 'white' : 'var(--color-primary)' }}
                                        onClick={() => setRegisterType(registerType === 'admin' ? 'none' : 'admin')}
                                    >
                                        <ShieldAlert size={18} />
                                        {registerType === 'admin' ? 'Cancelar Registro' : 'Añadir Admin'}
                                    </button>
                                </div>
                            </div>

                            {/* Formulario Integrado */}
                            {registerType === 'admin' && (
                                <div className="content-section" style={{ backgroundColor: 'transparent', boxShadow: 'none', padding: 0 }}>
                                    <RegisterAdmin />
                                </div>
                            )}

                            {/* Historial (Tabla vacía) */}
                            <div className="content-section">
                                <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Directorio de Usuarios</h2>
                                <div style={{ border: '1px solid rgba(0,0,0,0.05)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead style={{ backgroundColor: 'rgba(26, 43, 74, 0.05)' }}>
                                            <tr>
                                                <th style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>Cédula</th>
                                                <th style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>Nombre Completo</th>
                                                <th style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>Correo Electrónico</th>
                                                <th style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>Rol</th>
                                                <th style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Placeholder row */}
                                            <tr style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text)', opacity: 0.6 }}>
                                                    Aún no hay datos para mostrar en el historial.
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'scouts' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {/* Panel de Acciones */}
                            <div className="content-section" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h2 className="section-title">Registro de Scouts</h2>
                                    <p style={{ color: 'var(--color-text)', opacity: 0.7, margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                                        Añade nuevos scouts y vincula a sus encargados.
                                    </p>
                                </div>
                                <button 
                                    className="btn-outline" 
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: registerType === 'scout' ? 'var(--color-primary)' : 'transparent', color: registerType === 'scout' ? 'white' : 'var(--color-primary)' }}
                                    onClick={() => setRegisterType(registerType === 'scout' ? 'none' : 'scout')}
                                >
                                    <PlusCircle size={18} />
                                    {registerType === 'scout' ? 'Cancelar Registro' : 'Añadir Nuevo Scout'}
                                </button>
                            </div>

                            {/* Formulario Integrado */}
                            {registerType === 'scout' && (
                                <div className="content-section" style={{ backgroundColor: 'transparent', boxShadow: 'none', padding: 0 }}>
                                    <RegisterPage isEmbedded={true} />
                                </div>
                            )}

                            {/* Historial de Scouts (Tabla vacía) */}
                            <div className="content-section">
                                <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Directorio de Scouts</h2>
                                <div style={{ border: '1px solid rgba(0,0,0,0.05)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead style={{ backgroundColor: 'rgba(26, 43, 74, 0.05)' }}>
                                            <tr>
                                                <th style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>Cédula Scout</th>
                                                <th style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>Nombre Completo</th>
                                                <th style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>Edad</th>
                                                <th style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>Encargado Vinculado</th>
                                                <th style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Placeholder row */}
                                            <tr style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text)', opacity: 0.6 }}>
                                                    Aún no hay datos para mostrar en el directorio.
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab !== 'inicio' && activeTab !== 'usuarios' && activeTab !== 'scouts' && (
                        <div className="content-section" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ textAlign: 'center', color: 'var(--color-text)', opacity: 0.7 }}>
                                <div style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}><Activity size={64} opacity={0.5} /></div>
                                <h2>Módulo en Construcción</h2>
                                <p>Esta sección estará disponible próximamente con funcionalidades conectadas a la base de datos.</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
