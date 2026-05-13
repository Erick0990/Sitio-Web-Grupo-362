import React, { useState, useEffect } from 'react';
import { Users, Tent, CircleDollarSign, CalendarDays, ArrowUpRight, ArrowDownRight, AlertTriangle, Package, Clock } from 'lucide-react';
import { getAdmins, getEncargados, getScouts, getFinances, getActivities, getInventory } from '../../services/apiGetInfo';

export default function ResumenTab() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalScouts: 0,
        balance: 0,
        nextActivity: null,
        recentFinances: [],
        upcomingActivities: [],
        lowStockItems: []
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const [admins, encargados, scouts, finances, activities, inventory] = await Promise.all([
                getAdmins(),
                getEncargados(),
                getScouts(),
                getFinances(),
                getActivities(),
                getInventory()
            ]);

            // Cálculos
            const totalUsers = (admins.length || 0) + (encargados.length || 0);
            const totalScouts = scouts.length || 0;

            const totalIngresos = finances.filter(f => f.tipo === 'ingreso').reduce((sum, f) => sum + Number(f.monto), 0);
            const totalGastos = finances.filter(f => f.tipo === 'gasto').reduce((sum, f) => sum + Number(f.monto), 0);
            const balance = totalIngresos - totalGastos;

            // Siguiente actividad
            const today = new Date();
            const futureActivities = activities
                .filter(a => new Date(a.fecha_inicio) >= today)
                .sort((a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio));

            const nextActivity = futureActivities[0] || null;

            // Listas
            const recentFinances = [...finances].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 5);
            const upcomingActivities = futureActivities.slice(0, 5);
            const lowStockItems = inventory.filter(item => item.cantidad < 5 || item.estado === 'Malo').slice(0, 5);

            setStats({
                totalUsers,
                totalScouts,
                balance,
                nextActivity,
                recentFinances,
                upcomingActivities,
                lowStockItems
            });
        } catch (error) {
            console.error("Error al cargar datos del resumen:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', flexDirection: 'column', gap: '1rem' }}>
                <div className="loading-spinner"></div>
                <p style={{ opacity: 0.6 }}>Cargando resumen general...</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Tarjetas Principales */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <div className="stat-card primary">
                    <div className="stat-info">
                        <h3 className="stat-title">Usuarios Totales</h3>
                        <p className="stat-value">{stats.totalUsers}</p>
                    </div>
                    <div className="stat-icon"><Users size={28} /></div>
                </div>

                <div className="stat-card primary">
                    <div className="stat-info">
                        <h3 className="stat-title">Scouts Activos</h3>
                        <p className="stat-value">{stats.totalScouts}</p>
                    </div>
                    <div className="stat-icon"><Tent size={28} /></div>
                </div>

                <div className="stat-card primary">
                    <div className="stat-info">
                        <h3 className="stat-title">Balance General</h3>
                        <p className="stat-value">₡{stats.balance.toLocaleString('es-CR')}</p>
                    </div>
                    <div className="stat-icon"><CircleDollarSign size={28} /></div>
                </div>

                <div className="stat-card primary">
                    <div className="stat-info">
                        <h3 className="stat-title">Próxima Actividad</h3>
                        <p className="stat-value" style={{ fontSize: stats.nextActivity ? '1.1rem' : '1.5rem' }}>
                            {stats.nextActivity
                                ? new Date(stats.nextActivity.fecha_inicio).toLocaleDateString('es-CR', { day: 'numeric', month: 'short' })
                                : 'Sin eventos'}
                        </p>
                    </div>
                    <div className="stat-icon"><CalendarDays size={28} /></div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' }}>
                {/* Columna Izquierda: Finanzas y Alertas */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Movimientos Recientes */}
                    <div className="content-section" style={{ padding: '0' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-title)' }}>Movimientos Financieros Recientes</h3>
                            <CircleDollarSign size={20} opacity={0.3} />
                        </div>
                        <div style={{ padding: '0.5rem' }}>
                            {stats.recentFinances.length === 0 ? (
                                <p style={{ padding: '1.5rem', textAlign: 'center', opacity: 0.5 }}>No hay transacciones.</p>
                            ) : (
                                stats.recentFinances.map(f => (
                                    <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: f.tipo === 'ingreso' ? 'var(--color-success-bg)' : 'var(--color-danger-bg)' }}>
                                                {f.tipo === 'ingreso' ? <ArrowUpRight size={18} color="#10b981" /> : <ArrowDownRight size={18} color="#ef4444" />}
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{f.concepto}</p>
                                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(f.fecha).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <p style={{ margin: 0, fontWeight: 700, color: f.tipo === 'ingreso' ? '#10b981' : '#ef4444' }}>
                                            {f.tipo === 'ingreso' ? '+' : '-'}₡{Number(f.monto).toLocaleString()}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Alertas de Inventario */}
                    <div className="content-section" style={{ padding: '0', borderLeft: '4px solid #f59e0b' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <AlertTriangle size={20} color="#f59e0b" />
                                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-title)' }}>Alertas de Inventario</h3>
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning-text)' }}>
                                {stats.lowStockItems.length} alertas
                            </span>
                        </div>
                        <div style={{ padding: '0.5rem' }}>
                            {stats.lowStockItems.length === 0 ? (
                                <p style={{ padding: '1.5rem', textAlign: 'center', opacity: 0.5 }}>Todo en orden en bodega.</p>
                            ) : (
                                stats.lowStockItems.map(item => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <Package size={18} opacity={0.4} />
                                            <div>
                                                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{item.nombre}</p>
                                                <p style={{ margin: 0, fontSize: '0.75rem', color: item.estado === 'Malo' ? '#ef4444' : 'inherit', opacity: 0.7 }}>
                                                    Estado: {item.estado}
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ margin: 0, fontWeight: 700, color: item.cantidad < 3 ? '#ef4444' : '#f59e0b' }}>
                                                {item.cantidad} unidades
                                            </p>
                                            <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)' }}>Stock Bajo</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Próximas Actividades */}
                <div className="content-section" style={{ padding: '0' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-card-inner)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CalendarDays size={22} color="var(--color-primary)" />
                            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-title)' }}>Calendario Próximo</h3>
                        </div>
                        <Clock size={20} opacity={0.2} />
                    </div>
                    <div style={{ padding: '1rem' }}>
                        {stats.upcomingActivities.length === 0 ? (
                            <div style={{ padding: '3rem', textAlign: 'center', opacity: 0.5 }}>
                                <CalendarDays size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                                <p>No hay actividades programadas próximamente.</p>
                            </div>
                        ) : (
                            stats.upcomingActivities.map(act => (
                                <div key={act.id} style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', borderBottom: '1px solid var(--border-color)', position: 'relative' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '60px', height: '60px', backgroundColor: 'var(--color-primary)', color: '#ffffff', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                                        <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>{new Date(act.fecha_inicio).getDate()}</span>
                                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600 }}>{new Date(act.fecha_inicio).toLocaleString('es-CR', { month: 'short' })}</span>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-secondary)', textTransform: 'uppercase' }}>{act.tipo}</span>
                                            <span style={{ fontSize: '0.75rem', opacity: 0.5, color: 'var(--text-muted)' }}>{new Date(act.fecha_inicio).getFullYear()}</span>
                                        </div>
                                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--text-title)' }}>{act.titulo}</h4>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', opacity: 0.7 }}>
                                            <Clock size={14} />
                                            <span style={{ color: 'var(--text-muted)' }}>Inicia: {new Date(act.fecha_inicio).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {stats.upcomingActivities.length > 0 && (
                        <div style={{ padding: '1rem', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Mostrando los próximos 5 eventos programados</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
