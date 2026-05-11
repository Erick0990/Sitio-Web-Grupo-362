import React, { useState, useEffect } from 'react';
import { CircleDollarSign, PlusCircle, Trash2, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import DeleteFinanceModal from '../../components/DeleteFinanceModal';
import { getFinances, addFinance, deleteFinance } from '../../services/apiGetInfo';

export default function FinanzasTab({ user }) {
    const [finances, setFinances] = useState([]);
    const [newFinance, setNewFinance] = useState({ concepto: '', tipo: 'ingreso', monto: '' });
    const [isLoading, setIsLoading] = useState(false);

    // Estados para eliminación
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [financeToDelete, setFinanceToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchFinancesData();
    }, []);

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

    const handleAddFinance = async (e) => {
        e.preventDefault();
        try {
            await addFinance({
                ...newFinance,
                encargado_cedula: user.cedula
            });
            setNewFinance({ concepto: '', tipo: 'ingreso', monto: '' });
            fetchFinancesData();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDeleteFinanceClick = (finance) => {
        setFinanceToDelete(finance);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDeleteFinance = async () => {
        if (!financeToDelete) return;
        setIsDeleting(true);
        try {
            await deleteFinance(financeToDelete.id);
            setIsDeleteModalOpen(false);
            setFinanceToDelete(null);
            fetchFinancesData();
        } catch (error) {
            alert(error.message);
        } finally {
            setIsDeleting(false);
        }
    };

    // Cálculos financieros
    const totalIngresos = finances.filter(f => f.tipo === 'ingreso').reduce((sum, f) => sum + Number(f.monto), 0);
    const totalGastos = finances.filter(f => f.tipo === 'gasto').reduce((sum, f) => sum + Number(f.monto), 0);
    const balance = totalIngresos - totalGastos;
    const totalMovimientos = totalIngresos + totalGastos;
    const pctIngresos = totalMovimientos === 0 ? 50 : Math.round((totalIngresos / totalMovimientos) * 100);
    const pctGastos = totalMovimientos === 0 ? 50 : Math.round((totalGastos / totalMovimientos) * 100);

    return (
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
                                                <button onClick={() => handleDeleteFinanceClick(f)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', opacity: 0.7 }} title="Eliminar registro">
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

            <DeleteFinanceModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDeleteFinance}
                financeToDelete={financeToDelete}
                isDeleting={isDeleting}
            />
        </div>
    );
}
