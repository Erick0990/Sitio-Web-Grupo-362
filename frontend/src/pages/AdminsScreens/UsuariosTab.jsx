import React, { useState, useEffect } from 'react';
import { ShieldAlert, Edit, Trash2 } from 'lucide-react';
import RegisterAdmin from '../Register/RegisterAdmin';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import EditUserModal from '../../components/EditUserModal';
import { getAdmins, getEncargados, deleteUser, editUser } from '../../services/apiGetInfo';

export default function UsuariosTab() {
    const [admins, setAdmins] = useState([]);
    const [encargados, setEncargados] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [registerType, setRegisterType] = useState('none');

    // Estados para eliminación de usuarios
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Estados para edición de usuarios
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchUsersData();
    }, []);

    const fetchUsersData = async () => {
        setIsLoading(true);
        try {
            const adminsData = await getAdmins();
            const encargadosData = await getEncargados();
            setAdmins(adminsData);
            setEncargados(encargadosData);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
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
            fetchUsersData();
        } catch (error) {
            alert(error.message);
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
            fetchUsersData();
        } catch (error) {
            alert(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
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
        </div>
    );
}
