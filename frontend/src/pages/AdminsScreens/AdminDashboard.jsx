import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Tent, CircleDollarSign, CalendarDays, ClipboardCheck, LogOut, Activity, Clock, PlusCircle, ShieldAlert, Edit, Trash2, DollarSign, TrendingUp, TrendingDown, Send, MapPin, AlignLeft } from 'lucide-react';
import RegisterPage from '../Register/RegisterPage';
import RegisterAdmin from '../Register/RegisterAdmin';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import EditUserModal from '../../components/EditUserModal';
import DeleteScoutModal from '../../components/DeleteScoutModal';
import EditScoutModal from '../../components/EditScoutModal';
import EditActivityModal from '../../components/EditActivityModal';
import { getAdmins, getEncargados, deleteUser, editUser, getScouts, deleteScout, editScout, getFinances, addFinance, deleteFinance, getActivities, addActivity, deleteActivity, editActivity } from '../../services/apiGetInfo';
import '../../css/adminDashboard.css';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('inicio');
    const [registerType, setRegisterType] = useState('none'); // 'none', 'admin'
    const [admins, setAdmins] = useState([]);
    const [encargados, setEncargados] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Estados para eliminación de usuarios
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Estados para edición de usuarios
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Estados para scouts
    const [scouts, setScouts] = useState([]);
    const [isDeleteScoutModalOpen, setIsDeleteScoutModalOpen] = useState(false);
    const [scoutToDelete, setScoutToDelete] = useState(null);
    const [isEditScoutModalOpen, setIsEditScoutModalOpen] = useState(false);
    const [scoutToEdit, setScoutToEdit] = useState(null);

    // Estados para finanzas
    const [finances, setFinances] = useState([]);
    const [newFinance, setNewFinance] = useState({ concepto: '', tipo: 'ingreso', monto: '' });

    // Estados para actividades
    const [activities, setActivities] = useState([]);
    const [newActivity, setNewActivity] = useState({
        titulo: '', descripcion: '', fecha_inicio: '', fecha_fin: '', lugar: '', costo: '', tipo: 'Reunión'
    });
    const [isEditActivityModalOpen, setIsEditActivityModalOpen] = useState(false);
    const [activityToEdit, setActivityToEdit] = useState(null);

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

    const fetchUsersData = async () => {
        setIsLoading(true);
        try {
            console.log('Iniciando fetchUsersData');
            const adminsData = await getAdmins();
            console.log('Admins obtenidos:', adminsData);
            const encargadosData = await getEncargados();
            console.log('Encargados obtenidos:', encargadosData);
            setAdmins(adminsData);
            setEncargados(encargadosData);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchScoutsData = async () => {
        setIsLoading(true);
        try {
            const sc = await getScouts();
            setScouts(sc);
        } catch (error) {
            console.error("Error al cargar scouts:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'usuarios' && user?.rol === 'administrador') {
            fetchUsersData();
        }
        if (activeTab === 'scouts' && user?.rol === 'administrador') {
            fetchScoutsData();
        }
        if (activeTab === 'finanzas' && user?.rol === 'administrador') {
            fetchFinancesData();
        }
        if (activeTab === 'actividades' && user?.rol === 'administrador') {
            fetchActivitiesData();
        }
    }, [activeTab, user]);

    const fetchActivitiesData = async () => {
        setIsLoading(true);
        try {
            const data = await getActivities();
            setActivities(data);
        } catch (error) {
            console.error("Error al cargar actividades:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchFinancesData = async () => {
        setIsLoading(true);
        try {
            const data = await getFinances();
            setFinances(data);
        } catch (error) {
            console.error("Error al cargar finanzas:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = (userObj) => {
        setUserToDelete(userObj);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;
        setIsDeleting(true);
        try {
            await deleteUser(userToDelete.cedula);
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
            fetchUsersData(); // Refrescar tablas
        } catch (error) {
            console.error("No se pudo eliminar al usuario:", error);
            alert("No se pudo eliminar al usuario. " + error.message);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEditClick = (userObj) => {
        setUserToEdit(userObj);
        setIsEditModalOpen(true);
    };

    const handleConfirmEdit = async (cedula, userData) => {
        setIsSaving(true);
        try {
            await editUser(cedula, userData);
            setIsEditModalOpen(false);
            setUserToEdit(null);
            fetchUsersData(); // Refrescar tablas
        } catch (error) {
            console.error("No se pudo editar al usuario:", error);
            alert("No se pudo editar al usuario. " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteScoutClick = (scoutObj) => {
        setScoutToDelete(scoutObj);
        setIsDeleteScoutModalOpen(true);
    };

    const handleConfirmDeleteScout = async () => {
        if (!scoutToDelete) return;
        setIsDeleting(true);
        try {
            await deleteScout(scoutToDelete.cedula);
            setIsDeleteScoutModalOpen(false);
            setScoutToDelete(null);
            fetchScoutsData(); // Refrescar tablas
        } catch (error) {
            console.error("No se pudo eliminar al scout:", error);
            alert("No se pudo eliminar al scout. " + error.message);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEditScoutClick = (scoutObj) => {
        setScoutToEdit(scoutObj);
        setIsEditScoutModalOpen(true);
    };

    const handleConfirmEditScout = async (cedula, scoutData) => {
        setIsSaving(true);
        try {
            await editScout(cedula, scoutData);
            setIsEditScoutModalOpen(false);
            setScoutToEdit(null);
            fetchScoutsData(); // Refrescar tablas
        } catch (error) {
            console.error("No se pudo editar al scout:", error);
            alert("No se pudo editar al scout. " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    // Finanzas Handlers y Cálculos
    const handleAddFinance = async (e) => {
        e.preventDefault();
        try {
            await addFinance({ ...newFinance, encargado_cedula: user.cedula });
            setNewFinance({ concepto: '', tipo: 'ingreso', monto: '' });
            fetchFinancesData();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDeleteFinanceClick = async (id) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta transacción? Esta acción no se puede deshacer.')) return;
        try {
            await deleteFinance(id);
            fetchFinancesData();
        } catch (error) {
            alert(error.message);
        }
    };

    const totalIngresos = finances.filter(f => f.tipo === 'ingreso').reduce((acc, f) => acc + Number(f.monto), 0);
    const totalGastos = finances.filter(f => f.tipo === 'gasto').reduce((acc, f) => acc + Number(f.monto), 0);
    const balance = totalIngresos - totalGastos;
    const totalMovimientos = totalIngresos + totalGastos;
    const pctIngresos = totalMovimientos === 0 ? 50 : Math.round((totalIngresos / totalMovimientos) * 100);
    const pctGastos = totalMovimientos === 0 ? 50 : Math.round((totalGastos / totalMovimientos) * 100);

    // Actividades Handlers
    const handleAddActivity = async (e) => {
        e.preventDefault();
        try {
            await addActivity({ ...newActivity });
            setNewActivity({ titulo: '', descripcion: '', fecha_inicio: '', fecha_fin: '', lugar: '', costo: '', tipo: 'Reunión' });
            fetchActivitiesData();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDeleteActivityClick = async (id) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta actividad?')) return;
        try {
            await deleteActivity(id);
            fetchActivitiesData();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleEditActivityClick = (actObj) => {
        setActivityToEdit(actObj);
        setIsEditActivityModalOpen(true);
    };

    const handleConfirmEditActivity = async (id, actData) => {
        setIsSaving(true);
        try {
            await editActivity(id, actData);
            setIsEditActivityModalOpen(false);
            setActivityToEdit(null);
            fetchActivitiesData();
        } catch (error) {
            alert(error.message);
        } finally {
            setIsSaving(false);
        }
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
                    <a className={`nav-item ${activeTab === 'asistencias' ? 'active' : ''}`} onClick={() => setActiveTab('asistencias')}>
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
                                    <h2 className="section-title">Administradores</h2>
                                    <p style={{ color: 'var(--color-text)', opacity: 0.7, margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                                        Gestiona las cuentas con acceso administrativo al sistema.
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
                                    <RegisterAdmin onRegisterSuccess={fetchUsersData} />
                                </div>
                            )}

                            {/* Historial de Administradores */}
                            <div className="content-section">
                                <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Directorio de Administradores</h2>
                                <div style={{ border: '1px solid rgba(0,0,0,0.05)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead style={{ backgroundColor: 'rgba(26, 43, 74, 0.05)' }}>
                                            <tr>
                                                <th style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>Cédula</th>
                                                <th style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>Nombre Completo</th>
                                                <th style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>F. Nacimiento</th>
                                                <th style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>Teléfono</th>
                                                <th style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>Correo Electrónico</th>
                                                <th style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>Rol</th>
                                                <th style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600, textAlign: 'center' }}>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {isLoading ? (
                                                <tr style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                                    <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text)', opacity: 0.6 }}>Cargando administradores...</td>
                                                </tr>
                                            ) : admins.length === 0 ? (
                                                <tr style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                                    <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text)', opacity: 0.6 }}>No hay administradores registrados.</td>
                                                </tr>
                                            ) : (
                                                admins.map(admin => (
                                                    <tr key={admin.cedula} style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                                        <td style={{ padding: '1rem' }}>{admin.cedula}</td>
                                                        <td style={{ padding: '1rem' }}>{admin.nombre} {admin.apellidos}</td>
                                                        <td style={{ padding: '1rem' }}>{new Date(admin.fecha_nacimiento).toLocaleDateString()}</td>
                                                        <td style={{ padding: '1rem' }}>{admin.telefono}</td>
                                                        <td style={{ padding: '1rem' }}>{admin.email}</td>
                                                        <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{admin.rol}</td>
                                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                            <button className="action-btn" title="Editar" onClick={() => handleEditClick(admin)} style={{ background: 'none', border: 'none', cursor: 'pointer', margin: '0 5px', color: 'var(--color-primary)' }}><Edit size={18} /></button>
                                                            <button className="action-btn" title="Eliminar" onClick={() => handleDeleteClick(admin)} style={{ background: 'none', border: 'none', cursor: 'pointer', margin: '0 5px', color: '#dc3545' }}><Trash2 size={18} /></button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Panel de Encargados */}
                            <div className="content-section" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                                <div>
                                    <h2 className="section-title">Encargados (Padres/Tutores)</h2>
                                    <p style={{ color: 'var(--color-text)', opacity: 0.7, margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                                        Directorio de encargados de los scouts. Se añaden automáticamente al registrar un scout.
                                    </p>
                                </div>
                            </div>

                            {/* Tabla de Encargados */}
                            <div className="content-section">
                                <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Directorio de Encargados</h2>
                                <div style={{ border: '1px solid rgba(0,0,0,0.05)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead style={{ backgroundColor: 'rgba(26, 43, 74, 0.05)' }}>
                                            <tr>
                                                <th style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>Cédula</th>
                                                <th style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>Nombre Completo</th>
                                                <th style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>F. Nacimiento</th>
                                                <th style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>Teléfono</th>
                                                <th style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>Correo Electrónico</th>
                                                <th style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>Rol</th>
                                                <th style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600, textAlign: 'center' }}>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {isLoading ? (
                                                <tr style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                                    <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text)', opacity: 0.6 }}>Cargando encargados...</td>
                                                </tr>
                                            ) : encargados.length === 0 ? (
                                                <tr style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                                    <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text)', opacity: 0.6 }}>No hay encargados registrados.</td>
                                                </tr>
                                            ) : (
                                                encargados.map(enc => (
                                                    <tr key={enc.cedula} style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                                        <td style={{ padding: '1rem' }}>{enc.cedula}</td>
                                                        <td style={{ padding: '1rem' }}>{enc.nombre} {enc.apellidos}</td>
                                                        <td style={{ padding: '1rem' }}>{new Date(enc.fecha_nacimiento).toLocaleDateString()}</td>
                                                        <td style={{ padding: '1rem' }}>{enc.telefono}</td>
                                                        <td style={{ padding: '1rem' }}>{enc.email}</td>
                                                        <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{enc.rol}</td>
                                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                            <button className="action-btn" title="Editar" onClick={() => handleEditClick(enc)} style={{ background: 'none', border: 'none', cursor: 'pointer', margin: '0 5px', color: 'var(--color-primary)' }}><Edit size={18} /></button>
                                                            <button className="action-btn" title="Eliminar" onClick={() => handleDeleteClick(enc)} style={{ background: 'none', border: 'none', cursor: 'pointer', margin: '0 5px', color: '#dc3545' }}><Trash2 size={18} /></button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
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
                                                <th style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>Fecha de Nacimiento</th>
                                                <th style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>Edad</th>
                                                <th style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>Cédula Encargado</th>
                                                <th style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>Nombre Encargado</th>
                                                <th style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {isLoading ? (
                                                <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center' }}>Cargando datos...</td></tr>
                                            ) : scouts.length === 0 ? (
                                                <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center', opacity: 0.6 }}>Aún no hay scouts registrados.</td></tr>
                                            ) : (
                                                scouts.map(scout => (
                                                    <tr key={scout.cedula} style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                                        <td style={{ padding: '1rem', fontWeight: 500 }}>{scout.cedula}</td>
                                                        <td style={{ padding: '1rem' }}>{scout.nombre} {scout.apellidos}</td>
                                                        <td style={{ padding: '1rem' }}>{new Date(scout.fecha_nacimiento).toLocaleDateString()}</td>
                                                        <td style={{ padding: '1rem' }}>{scout.edad} años</td>
                                                        <td style={{ padding: '1rem' }}>{scout.cedula_encargado}</td>
                                                        <td style={{ padding: '1rem' }}>{scout.nombre_encargado}</td>
                                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                            <button className="action-btn" title="Editar" onClick={() => handleEditScoutClick(scout)} style={{ background: 'none', border: 'none', cursor: 'pointer', margin: '0 5px', color: 'var(--color-primary)' }}><Edit size={18} /></button>
                                                            <button className="action-btn" title="Eliminar" onClick={() => handleDeleteScoutClick(scout)} style={{ background: 'none', border: 'none', cursor: 'pointer', margin: '0 5px', color: '#dc3545' }}><Trash2 size={18} /></button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'finanzas' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {/* Tarjetas Métricas */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                                <div className="content-section" style={{ padding: '1.5rem', borderLeft: '4px solid #3b82f6' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <p style={{ color: 'var(--color-text)', opacity: 0.7, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Balance Total</p>
                                            <h3 style={{ fontSize: '2rem', margin: 0, color: 'var(--color-primary)' }}>₡{balance.toLocaleString()}</h3>
                                        </div>
                                        <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%' }}>
                                            <DollarSign size={24} color="#3b82f6" />
                                        </div>
                                    </div>
                                </div>

                                <div className="content-section" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <p style={{ color: 'var(--color-text)', opacity: 0.7, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Ingresos</p>
                                            <h3 style={{ fontSize: '2rem', margin: 0, color: '#10b981' }}>₡{totalIngresos.toLocaleString()}</h3>
                                        </div>
                                        <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%' }}>
                                            <TrendingUp size={24} color="#10b981" />
                                        </div>
                                    </div>
                                </div>

                                <div className="content-section" style={{ padding: '1.5rem', borderLeft: '4px solid #ef4444' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <p style={{ color: 'var(--color-text)', opacity: 0.7, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Gastos</p>
                                            <h3 style={{ fontSize: '2rem', margin: 0, color: '#ef4444' }}>₡{totalGastos.toLocaleString()}</h3>
                                        </div>
                                        <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%' }}>
                                            <TrendingDown size={24} color="#ef4444" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Barra de Progreso Visual */}
                            <div className="content-section" style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Proporción de Movimientos</h3>
                                <div style={{ width: '100%', height: '24px', backgroundColor: '#f3f4f6', borderRadius: '12px', overflow: 'hidden', display: 'flex' }}>
                                    <div style={{ width: `${pctIngresos}%`, backgroundColor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: 'bold', transition: 'width 0.5s ease' }}>
                                        {pctIngresos > 10 ? `${pctIngresos}%` : ''}
                                    </div>
                                    <div style={{ width: `${pctGastos}%`, backgroundColor: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: 'bold', transition: 'width 0.5s ease' }}>
                                        {pctGastos > 10 ? `${pctGastos}%` : ''}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text)', opacity: 0.7 }}>
                                    <span>Ingresos</span>
                                    <span>Gastos</span>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                                {/* Formulario Registro Rápido */}
                                <div className="content-section" style={{ padding: '1.5rem', height: 'fit-content' }}>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Registrar Movimiento</h3>
                                    <form onSubmit={handleAddFinance} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Concepto</label>
                                            <input
                                                type="text"
                                                required
                                                value={newFinance.concepto}
                                                onChange={(e) => setNewFinance({ ...newFinance, concepto: e.target.value })}
                                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.1)' }}
                                                placeholder="Ej. Pago cuota scout"
                                            />
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Tipo</label>
                                                <select
                                                    value={newFinance.tipo}
                                                    onChange={(e) => setNewFinance({ ...newFinance, tipo: e.target.value })}
                                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.1)' }}
                                                >
                                                    <option value="ingreso">Ingreso</option>
                                                    <option value="gasto">Gasto</option>
                                                </select>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Monto (₡)</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={newFinance.monto ? `₡ ${Number(newFinance.monto).toLocaleString('es-CR')}` : ''}
                                                    onChange={(e) => {
                                                        const rawValue = e.target.value.replace(/\D/g, '');
                                                        setNewFinance({ ...newFinance, monto: rawValue });
                                                    }}
                                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.1)' }}
                                                    placeholder="₡ 0"
                                                />
                                            </div>
                                        </div>
                                        <button type="submit" style={{ padding: '0.75rem', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                            <PlusCircle size={18} /> Agregar
                                        </button>
                                    </form>
                                </div>

                                {/* Tabla de Historial */}
                                <div className="content-section" style={{ padding: '0' }}>
                                    <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                        <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--color-primary)' }}>Historial de Transacciones</h3>
                                    </div>
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                            <thead style={{ backgroundColor: 'rgba(26, 43, 74, 0.02)' }}>
                                                <tr>
                                                    <th style={{ padding: '1rem', color: 'var(--color-text)', opacity: 0.7, fontWeight: 600, fontSize: '0.9rem' }}>Fecha</th>
                                                    <th style={{ padding: '1rem', color: 'var(--color-text)', opacity: 0.7, fontWeight: 600, fontSize: '0.9rem' }}>Concepto</th>
                                                    <th style={{ padding: '1rem', color: 'var(--color-text)', opacity: 0.7, fontWeight: 600, fontSize: '0.9rem' }}>Registrado por</th>
                                                    <th style={{ padding: '1rem', color: 'var(--color-text)', opacity: 0.7, fontWeight: 600, fontSize: '0.9rem', textAlign: 'right' }}>Monto</th>
                                                    <th style={{ padding: '1rem', color: 'var(--color-text)', opacity: 0.7, fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {isLoading ? (
                                                    <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</td></tr>
                                                ) : finances.length === 0 ? (
                                                    <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>No hay registros financieros.</td></tr>
                                                ) : (
                                                    finances.map(f => (
                                                        <tr key={f.id} style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                                            <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{new Date(f.fecha).toLocaleString()}</td>
                                                            <td style={{ padding: '1rem', fontWeight: 500 }}>{f.concepto}</td>
                                                            <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{f.nombre_encargado}</td>
                                                            <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: f.tipo === 'ingreso' ? '#10b981' : '#ef4444' }}>
                                                                {f.tipo === 'ingreso' ? '+' : '-'}₡{Number(f.monto).toLocaleString()}
                                                            </td>
                                                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                                <button onClick={() => handleDeleteFinanceClick(f.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', opacity: 0.7 }} title="Eliminar registro">
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'actividades' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h2 style={{ color: 'var(--color-primary)', fontSize: '1.5rem', margin: 0 }}>Gestión de Actividades</h2>
                                    <p style={{ color: 'var(--color-text)', opacity: 0.7, margin: '0.5rem 0 0 0' }}>Planifica y visualiza los eventos del grupo scout.</p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                                {/* Formulario para agregar actividad */}
                                <div className="content-section" style={{ padding: '1.5rem', height: 'fit-content' }}>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Nueva Actividad</h3>
                                    <form onSubmit={handleAddActivity} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Título</label>
                                            <input type="text" required value={newActivity.titulo} onChange={(e) => setNewActivity({ ...newActivity, titulo: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.1)' }} placeholder="Ej. Campamento de Verano" />
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Tipo</label>
                                                <select value={newActivity.tipo} onChange={(e) => setNewActivity({ ...newActivity, tipo: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.1)' }}>
                                                    <option value="Reunión">Reunión</option>
                                                    <option value="Campamento">Campamento</option>
                                                    <option value="Excursión">Excursión</option>
                                                    <option value="Servicio">Servicio</option>
                                                </select>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Costo (₡)</label>
                                                <input type="text" value={newActivity.costo ? `₡ ${Number(newActivity.costo).toLocaleString('es-CR')}` : ''} onChange={(e) => { const rawValue = e.target.value.replace(/\D/g, ''); setNewActivity({ ...newActivity, costo: rawValue }); }} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.1)' }} placeholder="₡ 0" />
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Fecha Inicio</label>
                                                <input type="date" required value={newActivity.fecha_inicio} onChange={(e) => setNewActivity({ ...newActivity, fecha_inicio: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.1)' }} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Fecha Fin</label>
                                                <input type="date" required value={newActivity.fecha_fin} onChange={(e) => setNewActivity({ ...newActivity, fecha_fin: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.1)' }} />
                                            </div>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Lugar</label>
                                            <input type="text" value={newActivity.lugar} onChange={(e) => setNewActivity({ ...newActivity, lugar: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.1)' }} placeholder="Ubicación" />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Descripción</label>
                                            <textarea
                                                value={newActivity.descripcion}
                                                onChange={(e) => setNewActivity({ ...newActivity, descripcion: e.target.value })}
                                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', border: '1px solid rgba(0,0,0,0.1)', resize: 'vertical' }}
                                                placeholder="Detalles adicionales"
                                                rows="3"
                                            ></textarea>
                                        </div>
                                        <button type="submit" style={{ padding: '0.75rem', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                            <PlusCircle size={18} /> Agregar Actividad
                                        </button>
                                    </form>
                                </div>

                                {/* Cuadrícula de Tarjetas (Cards) de Actividades */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', alignContent: 'start' }}>
                                    {isLoading ? (
                                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>Cargando actividades...</div>
                                    ) : activities.length === 0 ? (
                                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', opacity: 0.5, backgroundColor: 'white', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0,0,0,0.05)' }}>No hay actividades registradas.</div>
                                    ) : (
                                        activities.map(act => {
                                            const typeColors = {
                                                'Reunión': { bg: '#e0f2fe', text: '#0284c7' },
                                                'Campamento': { bg: '#dcfce7', text: '#16a34a' },
                                                'Excursión': { bg: '#fef3c7', text: '#d97706' },
                                                'Servicio': { bg: '#f3e8ff', text: '#9333ea' }
                                            };
                                            const colors = typeColors[act.tipo] || typeColors['Reunión'];

                                            return (
                                                <div key={act.id} style={{ backgroundColor: 'white', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0,0,0,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s', ':hover': { transform: 'translateY(-2px)', boxShadow: 'var(--shadow-md)' } }}>
                                                    <div style={{ padding: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ backgroundColor: colors.bg, color: colors.text, padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                                                            {act.tipo}
                                                        </span>
                                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                            <button onClick={() => handleEditActivityClick(act)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', opacity: 0.7 }} title="Editar actividad"><Edit size={16} /></button>
                                                            <button onClick={() => handleDeleteActivityClick(act.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', opacity: 0.7 }} title="Eliminar actividad"><Trash2 size={16} /></button>
                                                        </div>
                                                    </div>
                                                    <div style={{ padding: '1.25rem', flex: 1 }}>
                                                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--color-primary)' }}>{act.titulo}</h4>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-text)', opacity: 0.8, fontSize: '0.85rem' }}>
                                                            <CalendarDays size={14} />
                                                            <span>{new Date(act.fecha_inicio).toLocaleDateString()} - {new Date(act.fecha_fin).toLocaleDateString()}</span>
                                                        </div>
                                                        {act.lugar && (
                                                            <div style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
                                                                <a
                                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(act.lugar)}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', textDecoration: 'none', opacity: 0.9, transition: 'opacity 0.2s' }}
                                                                    onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                                                                    onMouseOut={(e) => e.currentTarget.style.opacity = 0.9}
                                                                    title="Buscar en Google Maps"
                                                                >
                                                                    <MapPin size={14} />
                                                                    <span style={{ textDecoration: 'underline' }}>{act.lugar}</span>
                                                                </a>
                                                            </div>
                                                        )}
                                                        <div style={{ backgroundColor: '#f9fafb', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--color-text)', opacity: 0.9 }}>
                                                            <AlignLeft size={14} style={{ marginBottom: '-2px', marginRight: '4px', opacity: 0.5 }} />
                                                            {act.descripcion || 'Sin descripción.'}
                                                        </div>
                                                    </div>
                                                    <div style={{ padding: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb' }}>
                                                        <span style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: '0.95rem' }}>
                                                            {Number(act.costo) > 0 ? `₡ ${Number(act.costo).toLocaleString('es-CR')}` : 'Gratis'}
                                                        </span>
                                                        <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'white', border: '1px solid rgba(0,0,0,0.1)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-text)', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'} onClick={() => alert('¡Pronto! Esta función enviará un correo a todos los scouts y encargados.')}>
                                                            <Send size={14} color="#3b82f6" /> Notificar
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab !== 'inicio' && activeTab !== 'usuarios' && activeTab !== 'scouts' && activeTab !== 'finanzas' && activeTab !== 'actividades' && (
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

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                userToDelete={userToDelete}
                isDeleting={isDeleting}
            />

            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleConfirmEdit}
                userToEdit={userToEdit}
                isSaving={isSaving}
            />

            <DeleteScoutModal
                isOpen={isDeleteScoutModalOpen}
                onClose={() => setIsDeleteScoutModalOpen(false)}
                onConfirm={handleConfirmDeleteScout}
                scoutToDelete={scoutToDelete}
                isDeleting={isDeleting}
            />

            <EditScoutModal
                isOpen={isEditScoutModalOpen}
                onClose={() => setIsEditScoutModalOpen(false)}
                onSave={handleConfirmEditScout}
                scoutToEdit={scoutToEdit}
                isSaving={isSaving}
            />

            <EditActivityModal
                isOpen={isEditActivityModalOpen}
                onClose={() => setIsEditActivityModalOpen(false)}
                onSave={handleConfirmEditActivity}
                activityToEdit={activityToEdit}
                isSaving={isSaving}
            />
        </div>
    );
}
