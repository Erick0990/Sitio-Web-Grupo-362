import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import RegisterPage from '../Register/RegisterPage';
import DeleteScoutModal from '../../components/DeleteScoutModal';
import EditScoutModal from '../../components/EditScoutModal';
import { getScouts, deleteScout, editScout } from '../../services/apiGetInfo';
import Pagination from '../../components/Pagination';

export default function ScoutsTab() {
    const [scouts, setScouts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [registerType, setRegisterType] = useState('none');

    // Estados para eliminación
    const [isDeleteScoutModalOpen, setIsDeleteScoutModalOpen] = useState(false);
    const [scoutToDelete, setScoutToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Estados para edición
    const [isEditScoutModalOpen, setIsEditScoutModalOpen] = useState(false);
    const [scoutToEdit, setScoutToEdit] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchScoutsData();
    }, []);

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
            fetchScoutsData();
        } catch (error) {
            alert(error.message);
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
            fetchScoutsData();
        } catch (error) {
            alert(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    // Lógica de Paginación
    const totalPages = Math.ceil(scouts.length / itemsPerPage);
    const paginatedScouts = scouts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Panel de Acciones */}
            <div className="content-section" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 className="section-title">Registro de Scouts</h2>
                    <p style={{ color: 'var(--text-main)', opacity: 0.7, margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
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

            {/* Historial de Scouts */}
            <div className="content-section">
                <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Directorio de Scouts</h2>
                <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: 'var(--bg-card-inner)' }}>
                            <tr>
                                <th style={{ padding: '1rem', color: 'var(--text-title)', fontWeight: 600 }}>Cédula Scout</th>
                                <th style={{ padding: '1rem', color: 'var(--text-title)', fontWeight: 600 }}>Nombre Completo</th>
                                <th style={{ padding: '1rem', color: 'var(--text-title)', fontWeight: 600 }}>Fecha de Nacimiento</th>
                                <th style={{ padding: '1rem', color: 'var(--text-title)', fontWeight: 600 }}>Edad</th>
                                <th style={{ padding: '1rem', color: 'var(--text-title)', fontWeight: 600 }}>Cédula Encargado</th>
                                <th style={{ padding: '1rem', color: 'var(--text-title)', fontWeight: 600 }}>Nombre Encargado</th>
                                <th style={{ padding: '1rem', color: 'var(--text-title)', fontWeight: 600 }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center' }}>Cargando datos...</td></tr>
                            ) : scouts.length === 0 ? (
                                <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center', opacity: 0.6 }}>Aún no hay scouts registrados.</td></tr>
                            ) : (
                                paginatedScouts.map(scout => (
                                    <tr key={scout.cedula} style={{ borderTop: '1px solid var(--border-light)' }}>
                                        <td style={{ padding: '1rem', fontWeight: 500 }}>{scout.cedula}</td>
                                        <td style={{ padding: '1rem' }}>{scout.nombre} {scout.apellidos}</td>
                                        <td style={{ padding: '1rem' }}>{new Date(scout.fecha_nacimiento).toLocaleDateString()}</td>
                                        <td style={{ padding: '1rem' }}>{scout.edad} años</td>
                                        <td style={{ padding: '1rem' }}>{scout.cedula_encargado}</td>
                                        <td style={{ padding: '1rem' }}>{scout.nombre_encargado}</td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <button className="action-btn" title="Editar" onClick={() => handleEditScoutClick(scout)} style={{ background: 'none', border: 'none', cursor: 'pointer', margin: '0 5px', color: 'var(--text-title)' }}><Edit size={18} /></button>
                                            <button className="action-btn" title="Eliminar" onClick={() => handleDeleteScoutClick(scout)} style={{ background: 'none', border: 'none', cursor: 'pointer', margin: '0 5px', color: '#dc3545' }}><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {scouts.length > 0 && (
                    <div style={{ borderTop: '1px solid var(--border-light)', backgroundColor: 'var(--bg-card)', borderBottomLeftRadius: 'var(--radius-md)', borderBottomRightRadius: 'var(--radius-md)' }}>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>

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
        </div>
    );
}
