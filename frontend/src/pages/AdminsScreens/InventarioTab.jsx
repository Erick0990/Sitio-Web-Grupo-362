import React, { useState, useEffect } from 'react';
import { Package, PlusCircle, Edit, Trash2, Plus, Minus, Info } from 'lucide-react';
import EditInventoryModal from '../../components/EditInventoryModal';
import DeleteInventoryModal from '../../components/DeleteInventoryModal';
import { getInventory, addInventoryItem, deleteInventoryItem, editInventoryItem, updateInventoryQuantity } from '../../services/apiGetInfo';

export default function InventarioTab() {
    const [inventory, setInventory] = useState([]);
    const [newItem, setNewItem] = useState({
        nombre: '', descripcion: '', cantidad: '', estado: 'Nuevo'
    });
    const [isLoading, setIsLoading] = useState(false);

    // Estados para edición
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Estados para eliminación
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchInventoryData();
    }, []);

    const fetchInventoryData = async () => {
        setIsLoading(true);
        try {
            const data = await getInventory();
            setInventory(data);
        } catch (error) {
            console.error("Error al cargar inventario:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            await addInventoryItem({ ...newItem, cantidad: parseInt(newItem.cantidad) || 0 });
            setNewItem({ nombre: '', descripcion: '', cantidad: '', estado: 'Nuevo' });
            fetchInventoryData();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        try {
            await deleteInventoryItem(itemToDelete.id);
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
            fetchInventoryData();
        } catch (error) {
            alert(error.message);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEditClick = (item) => {
        setItemToEdit(item);
        setIsEditModalOpen(true);
    };

    const handleConfirmEdit = async (id, itemData) => {
        setIsSaving(true);
        try {
            await editInventoryItem(id, itemData);
            setIsEditModalOpen(false);
            setItemToEdit(null);
            fetchInventoryData();
        } catch (error) {
            alert(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    // Edición Rápida (Sumar o Restar Cantidad)
    const handleQuickQuantityChange = async (id, currentCantidad, cambio) => {
        if (currentCantidad + cambio < 0) {
            alert("La cantidad no puede ser negativa.");
            return;
        }

        // Optimistic UI update para que se sienta instantáneo
        setInventory(prev => prev.map(item =>
            item.id === id ? { ...item, cantidad: item.cantidad + cambio } : item
        ));

        try {
            await updateInventoryQuantity(id, cambio);
        } catch (error) {
            alert(error.message);
            // Revertir si falla
            fetchInventoryData();
        }
    };

    const totalItems = inventory.reduce((sum, item) => sum + item.cantidad, 0);
    const totalTipos = inventory.length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header del Tab */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ color: 'var(--color-primary)', fontSize: '1.5rem', margin: 0 }}>Inventario Scout</h2>
                    <p style={{ color: 'var(--color-text)', opacity: 0.7, margin: '0.5rem 0 0 0' }}>
                        Gestiona todo el equipo y materiales del grupo. Total de artículos en bodega: <strong style={{ color: 'var(--color-primary)' }}>{totalItems}</strong> ({totalTipos} tipos de ítems).
                    </p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                {/* Formulario Registro Rápido */}
                <div className="content-section" style={{ padding: '1.5rem', height: 'fit-content' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Registrar Nuevo Ítem</h3>
                    <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Nombre del Ítem</label>
                            <input
                                type="text"
                                required
                                value={newItem.nombre}
                                onChange={(e) => setNewItem({ ...newItem, nombre: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.1)' }}
                                placeholder="Ej. Tienda de campaña 4 personas"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Descripción (Opcional)</label>
                            <textarea
                                value={newItem.descripcion}
                                onChange={(e) => setNewItem({ ...newItem, descripcion: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.1)', resize: 'vertical' }}
                                placeholder="Detalles de marca, color, etc."
                                rows="2"
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Cantidad</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={newItem.cantidad}
                                    onChange={(e) => setNewItem({ ...newItem, cantidad: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.1)' }}
                                    placeholder="0"
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Estado</label>
                                <select
                                    value={newItem.estado}
                                    onChange={(e) => setNewItem({ ...newItem, estado: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.1)' }}
                                >
                                    <option value="Nuevo">Nuevo</option>
                                    <option value="Bueno">Bueno</option>
                                    <option value="Regular">Regular</option>
                                    <option value="Malo">Malo</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" style={{ padding: '0.75rem', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <PlusCircle size={18} /> Agregar al Inventario
                        </button>
                    </form>
                </div>

                {/* Cuadrícula de Inventario */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', alignContent: 'start' }}>
                    {isLoading ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>Cargando inventario...</div>
                    ) : inventory.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', opacity: 0.5, backgroundColor: 'white', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0,0,0,0.05)' }}>
                            El inventario está vacío.
                        </div>
                    ) : (
                        inventory.map(item => {
                            // Colores según el estado
                            const statusColors = {
                                'Nuevo': { bg: '#dbeafe', text: '#2563eb' },      // Azul
                                'Bueno': { bg: '#dcfce7', text: '#16a34a' },      // Verde
                                'Regular': { bg: '#fef9c3', text: '#ca8a04' },    // Amarillo
                                'Malo': { bg: '#fee2e2', text: '#dc2626' }        // Rojo
                            };
                            const sColor = statusColors[item.estado] || statusColors['Bueno'];

                            return (
                                <div key={item.id} style={{ backgroundColor: 'white', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0,0,0,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s', ':hover': { transform: 'translateY(-2px)', boxShadow: 'var(--shadow-md)' } }}>

                                    {/* Header de la Tarjeta */}
                                    <div style={{ padding: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Package size={18} color="var(--color-primary)" opacity={0.7} />
                                            <span style={{ backgroundColor: sColor.bg, color: sColor.text, padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600 }}>
                                                {item.estado}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => handleEditClick(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', opacity: 0.7 }} title="Editar ítem completo"><Edit size={16} /></button>
                                            <button onClick={() => handleDeleteClick(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', opacity: 0.7 }} title="Eliminar del inventario"><Trash2 size={16} /></button>
                                        </div>
                                    </div>

                                    {/* Cuerpo de la Tarjeta */}
                                    <div style={{ padding: '1.25rem', flex: 1 }}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--color-text)' }}>{item.nombre}</h4>
                                        {item.descripcion && (
                                            <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--color-text)', opacity: 0.6, fontSize: '0.85rem', marginBottom: '1rem' }}>
                                                <Info size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                                                <p style={{ margin: 0 }}>{item.descripcion}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer con Controlador Rápido de Cantidad */}
                                    <div style={{ padding: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text)', opacity: 0.7, fontWeight: 500 }}>
                                            En bodega:
                                        </span>

                                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}>
                                            <button
                                                onClick={() => handleQuickQuantityChange(item.id, item.cantidad, -1)}
                                                style={{ padding: '0.4rem 0.6rem', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--color-text)', borderRight: '1px solid rgba(0,0,0,0.05)', transition: 'background 0.2s' }}
                                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                title="Sacar 1 unidad"
                                            >
                                                <Minus size={14} />
                                            </button>

                                            <span style={{ padding: '0 1rem', fontWeight: 700, color: 'var(--color-primary)', minWidth: '40px', textAlign: 'center' }}>
                                                {item.cantidad}
                                            </span>

                                            <button
                                                onClick={() => handleQuickQuantityChange(item.id, item.cantidad, 1)}
                                                style={{ padding: '0.4rem 0.6rem', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--color-text)', borderLeft: '1px solid rgba(0,0,0,0.05)', transition: 'background 0.2s' }}
                                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                title="Ingresar 1 unidad"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <EditInventoryModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleConfirmEdit}
                itemToEdit={itemToEdit}
                isSaving={isSaving}
            />

            <DeleteInventoryModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemToDelete={itemToDelete}
                isDeleting={isDeleting}
            />
        </div>
    );
}
