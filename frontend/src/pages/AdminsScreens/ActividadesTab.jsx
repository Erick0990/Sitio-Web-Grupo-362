import React, { useState, useEffect } from 'react';
import { CalendarDays, PlusCircle, Edit, Trash2, MapPin, AlignLeft, Send } from 'lucide-react';
import EditActivityModal from '../../components/EditActivityModal';
import DeleteActivityModal from '../../components/DeleteActivityModal';
import { getActivities, addActivity, deleteActivity, editActivity } from '../../services/apiGetInfo';
import Pagination from '../../components/Pagination';

export default function ActividadesTab() {
    const [activities, setActivities] = useState([]);
    const [newActivity, setNewActivity] = useState({
        titulo: '', descripcion: '', fecha_inicio: '', fecha_fin: '', lugar: '', costo: '', tipo: 'Reunión'
    });
    const [isLoading, setIsLoading] = useState(false);

    // Estados para edición
    const [isEditActivityModalOpen, setIsEditActivityModalOpen] = useState(false);
    const [activityToEdit, setActivityToEdit] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Estados para eliminación
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [activityToDelete, setActivityToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        fetchActivitiesData();
    }, []);

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

    const handleAddActivity = async (e) => {
        e.preventDefault();
        
        if (newActivity.fecha_inicio < today) {
            alert("No se pueden crear actividades en fechas pasadas.");
            return;
        }

        if (newActivity.fecha_fin < newActivity.fecha_inicio) {
            alert("La fecha de fin no puede ser anterior a la fecha de inicio.");
            return;
        }

        try {
            await addActivity({ ...newActivity });
            setNewActivity({ titulo: '', descripcion: '', fecha_inicio: '', fecha_fin: '', lugar: '', costo: '', tipo: 'Reunión' });
            fetchActivitiesData();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDeleteActivityClick = (act) => {
        setActivityToDelete(act);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDeleteActivity = async () => {
        if (!activityToDelete) return;
        setIsDeleting(true);
        try {
            await deleteActivity(activityToDelete.id);
            setIsDeleteModalOpen(false);
            setActivityToDelete(null);
            fetchActivitiesData();
        } catch (error) {
            alert(error.message);
        } finally {
            setIsDeleting(false);
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

    // Lógica de Paginación
    const totalPages = Math.ceil(activities.length / itemsPerPage);
    const paginatedActivities = activities.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ color: 'var(--text-title)', fontSize: '1.5rem', margin: 0 }}>Gestión de Actividades</h2>
                    <p style={{ color: 'var(--text-main)', opacity: 0.7, margin: '0.5rem 0 0 0' }}>Planifica y visualiza los eventos del grupo scout.</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                {/* Formulario para agregar actividad */}
                <div className="content-section" style={{ padding: '1.5rem', height: 'fit-content' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-title)' }}>Nueva Actividad</h3>
                    <form onSubmit={handleAddActivity} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Título</label>
                            <input type="text" required value={newActivity.titulo} onChange={(e) => setNewActivity({ ...newActivity, titulo: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)' }} placeholder="Ej. Campamento de Verano" />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Tipo</label>
                                <select value={newActivity.tipo} onChange={(e) => setNewActivity({ ...newActivity, tipo: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)' }}>
                                    <option value="Reunión">Reunión</option>
                                    <option value="Campamento">Campamento</option>
                                    <option value="Excursión">Excursión</option>
                                    <option value="Servicio">Servicio</option>
                                </select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Costo (₡)</label>
                                <input type="text" value={newActivity.costo ? `₡ ${Number(newActivity.costo).toLocaleString('es-CR')}` : ''} onChange={(e) => { const rawValue = e.target.value.replace(/\D/g, ''); setNewActivity({ ...newActivity, costo: rawValue }); }} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)' }} placeholder="₡ 0" />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Fecha Inicio</label>
                                <input 
                                    type="date" 
                                    required 
                                    min={today}
                                    value={newActivity.fecha_inicio} 
                                    onChange={(e) => setNewActivity({ ...newActivity, fecha_inicio: e.target.value })} 
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)' }} 
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Fecha Fin</label>
                                <input 
                                    type="date" 
                                    required 
                                    min={newActivity.fecha_inicio || today}
                                    value={newActivity.fecha_fin} 
                                    onChange={(e) => setNewActivity({ ...newActivity, fecha_fin: e.target.value })} 
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)' }} 
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Lugar</label>
                            <input type="text" value={newActivity.lugar} onChange={(e) => setNewActivity({ ...newActivity, lugar: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)' }} placeholder="Ubicación" />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Descripción</label>
                            <textarea
                                value={newActivity.descripcion}
                                onChange={(e) => setNewActivity({ ...newActivity, descripcion: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', border: '1px solid var(--border-strong)', resize: 'vertical' }}
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
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', opacity: 0.5, backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>No hay actividades registradas.</div>
                    ) : (
                        paginatedActivities.map(act => {
                            const typeColors = {
                                'Reunión': { bg: 'var(--color-info-bg)', text: 'var(--color-info-text)' },
                                'Campamento': { bg: 'var(--color-success-bg)', text: 'var(--color-success-text)' },
                                'Excursión': { bg: 'var(--color-warning-bg)', text: 'var(--color-warning-text)' },
                                'Servicio': { bg: 'var(--color-purple-bg)', text: 'var(--color-purple-text)' }
                            };
                            const colors = typeColors[act.tipo] || typeColors['Reunión'];

                            return (
                                <div key={act.id} style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s', ':hover': { transform: 'translateY(-2px)', boxShadow: 'var(--shadow-md)' } }}>
                                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ backgroundColor: colors.bg, color: colors.text, padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                                            {act.tipo}
                                        </span>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => handleEditActivityClick(act)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-title)', opacity: 0.7 }} title="Editar actividad"><Edit size={16} /></button>
                                            <button onClick={() => handleDeleteActivityClick(act)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', opacity: 0.7 }} title="Eliminar actividad"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                    <div style={{ padding: '1.25rem', flex: 1 }}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--text-title)' }}>{act.titulo}</h4>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-main)', opacity: 0.8, fontSize: '0.85rem' }}>
                                            <CalendarDays size={14} />
                                            <span>{new Date(act.fecha_inicio).toLocaleDateString()} - {new Date(act.fecha_fin).toLocaleDateString()}</span>
                                        </div>
                                        {act.lugar && (
                                            <div style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
                                                <a
                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(act.lugar)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-title)', textDecoration: 'none', opacity: 0.9, transition: 'opacity 0.2s' }}
                                                    onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                                                    onMouseOut={(e) => e.currentTarget.style.opacity = 0.9}
                                                    title="Buscar en Google Maps"
                                                >
                                                    <MapPin size={14} />
                                                    <span style={{ textDecoration: 'underline' }}>{act.lugar}</span>
                                                </a>
                                            </div>
                                        )}
                                        <div style={{ backgroundColor: 'var(--bg-card-inner)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--text-main)', opacity: 0.9 }}>
                                            <AlignLeft size={14} style={{ marginBottom: '-2px', marginRight: '4px', opacity: 0.5 }} />
                                            {act.descripcion || 'Sin descripción.'}
                                        </div>
                                    </div>
                                    <div style={{ padding: '1rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-card-inner)' }}>
                                        <span style={{ fontWeight: 600, color: 'var(--text-title)', fontSize: '0.95rem' }}>
                                            {Number(act.costo) > 0 ? `₡ ${Number(act.costo).toLocaleString('es-CR')}` : 'Gratis'}
                                        </span>
                                        <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-strong)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-main)', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card)'} onClick={() => alert('¡Pronto! Esta función enviará un correo a todos los scouts y encargados.')}>
                                            <Send size={14} color="#3b82f6" /> Notificar
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {activities.length > 0 && (
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={setCurrentPage} 
                />
            )}

            <EditActivityModal
                isOpen={isEditActivityModalOpen}
                onClose={() => setIsEditActivityModalOpen(false)}
                onSave={handleConfirmEditActivity}
                activityToEdit={activityToEdit}
                isSaving={isSaving}
            />

            <DeleteActivityModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDeleteActivity}
                activityToDelete={activityToDelete}
                isDeleting={isDeleting}
            />
        </div>
    );
}
