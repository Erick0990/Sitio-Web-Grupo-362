import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Tent, CircleDollarSign, CalendarDays, ClipboardCheck, LogOut, Activity, Clock, Sun, Moon } from 'lucide-react';
import UsuariosTab from './UsuariosTab';
import ScoutsTab from './ScoutsTab';
import FinanzasTab from './FinanzasTab';
import ActividadesTab from './ActividadesTab';
import InventarioTab from './InventarioTab';
import ResumenTab from './ResumenTab';
import '../../css/adminDashboard.css';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('inicio');
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

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

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

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
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-title)' }}>
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
                    <a className={`nav-item ${activeTab === 'usuarios' ? 'active' : ''}`} onClick={() => setActiveTab('usuarios')}>
                        <span className="nav-icon"><Users size={20} /></span>
                        Gestión de Usuarios
                    </a>
                    <a className={`nav-item ${activeTab === 'scouts' ? 'active' : ''}`} onClick={() => setActiveTab('scouts')}>
                        <span className="nav-icon"><Tent size={20} /></span>
                        Gestión de Scouts
                    </a>
                    <a className={`nav-item ${activeTab === 'finanzas' ? 'active' : ''}`} onClick={() => setActiveTab('finanzas')}>
                        <span className="nav-icon"><CircleDollarSign size={20} /></span>
                        Finanzas y Pagos
                    </a>
                    <a className={`nav-item ${activeTab === 'actividades' ? 'active' : ''}`} onClick={() => setActiveTab('actividades')}>
                        <span className="nav-icon"><CalendarDays size={20} /></span>
                        Actividades
                    </a>
                    <a className={`nav-item ${activeTab === 'inventario' ? 'active' : ''}`} onClick={() => setActiveTab('inventario')}>
                        <span className="nav-icon"><ClipboardCheck size={20} /></span>
                        Inventario
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
                        {activeTab === 'inventario' && 'Control de Inventario y Equipo'}
                    </h1>

                    <div className="topbar-user">
                        <button 
                            onClick={toggleTheme} 
                            style={{ 
                                background: 'none', 
                                border: 'none', 
                                cursor: 'pointer', 
                                color: 'var(--text-main)', 
                                padding: '8px', 
                                borderRadius: '50%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                transition: 'background 0.2s',
                                marginRight: '1rem'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            title={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
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
                    {activeTab === 'inicio' && <ResumenTab />}

                    {activeTab === 'usuarios' && <UsuariosTab />}
                    {activeTab === 'scouts' && <ScoutsTab />}
                    {activeTab === 'finanzas' && <FinanzasTab user={user} />}
                    {activeTab === 'actividades' && <ActividadesTab />}
                    {activeTab === 'inventario' && <InventarioTab />}

                    {activeTab !== 'inicio' && activeTab !== 'usuarios' && activeTab !== 'scouts' && activeTab !== 'finanzas' && activeTab !== 'actividades' && activeTab !== 'inventario' && (
                        <div className="content-section" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ textAlign: 'center', color: 'var(--text-main)', opacity: 0.7 }}>
                                <div style={{ marginBottom: '1rem', color: 'var(--text-title)' }}><Activity size={64} opacity={0.5} /></div>
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
