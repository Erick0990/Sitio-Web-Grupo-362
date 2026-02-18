import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { motion, AnimatePresence } from 'framer-motion';

// Interface matching the database schema
export interface Scout {
  id: string;
  nombre_completo: string;
  fecha_nacimiento: string;
  seccion: string;
  parent_id: string;
}

const SECTION_OPTIONS = ['Manada', 'Tropa', 'Comunidad', 'Wak'];

export const MyScouts = () => {
  const [scouts, setScouts] = useState<Scout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScout, setEditingScout] = useState<Scout | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nombre_completo: '',
    fecha_nacimiento: '',
    seccion: ''
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchScouts();
  }, []);

  const fetchScouts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('scouts')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setScouts(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (scout?: Scout) => {
    if (scout) {
      setEditingScout(scout);
      setFormData({
        nombre_completo: scout.nombre_completo,
        fecha_nacimiento: scout.fecha_nacimiento,
        seccion: scout.seccion
      });
    } else {
      setEditingScout(null);
      setFormData({
        nombre_completo: '',
        fecha_nacimiento: '',
        seccion: ''
      });
    }
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingScout(null);
    setFormData({
      nombre_completo: '',
      fecha_nacimiento: '',
      seccion: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.nombre_completo.trim()) return 'El nombre es obligatorio';
    if (!formData.fecha_nacimiento) return 'La fecha de nacimiento es obligatoria';
    if (!formData.seccion) return 'La sección es obligatoria';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      if (editingScout) {
        // Update
        const { error } = await supabase
          .from('scouts')
          .update({
            nombre_completo: formData.nombre_completo,
            fecha_nacimiento: formData.fecha_nacimiento,
            seccion: formData.seccion
          })
          .eq('id', editingScout.id);

        if (error) throw error;
      } else {
        // Create
        // parent_id is handled by RLS automatically on the backend via `auth.uid()` default?
        // Wait, looking at schema: `parent_id uuid references auth.users(id) default auth.uid() not null`
        // So we don't need to send it if the user is authenticated.
        const { error } = await supabase
          .from('scouts')
          .insert([{
            nombre_completo: formData.nombre_completo,
            fecha_nacimiento: formData.fecha_nacimiento,
            seccion: formData.seccion
          }]);

        if (error) throw error;
      }

      await fetchScouts();
      handleCloseModal();
    } catch (err: any) {
      setFormError(err.message || 'Error al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este scout? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('scouts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state directly to feel faster
      setScouts(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-dark flex items-center gap-2">
          <span className="text-2xl">⚜️</span> Mis Scouts
        </h2>
        <Button onClick={() => handleOpenModal()} size="sm" variant="primary">
          + Nuevo Scout
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <div key={i} className="h-32 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse"></div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
          {error}
        </div>
      ) : scouts.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500 mb-4">No has registrado scouts aún.</p>
          <Button onClick={() => handleOpenModal()} variant="outline" size="sm">
            Registrar mi primer scout
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {scouts.map((scout) => (
              <motion.div
                key={scout.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                layout
                className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 relative group"
              >
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenModal(scout)}
                    className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(scout.id)}
                    className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>

                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2
                    ${scout.seccion === 'Manada' ? 'bg-yellow-100 text-yellow-700' :
                      scout.seccion === 'Tropa' ? 'bg-green-100 text-green-700' :
                      scout.seccion === 'Comunidad' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700' // Wak
                    }
                  `}>
                    {scout.seccion}
                  </span>
                  <h3 className="text-xl font-bold text-dark">{scout.nombre_completo}</h3>
                </div>

                <div className="text-gray-500 text-sm">
                  <p>Edad: <span className="font-semibold text-dark">{calculateAge(scout.fecha_nacimiento)} años</span></p>
                  <p>Cumpleaños: <span className="font-semibold text-dark">{new Date(scout.fecha_nacimiento).toLocaleDateString()}</span></p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="relative bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl z-10"
            >
              <h3 className="text-2xl font-bold text-dark mb-6">
                {editingScout ? 'Editar Scout' : 'Nuevo Scout'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nombre Completo"
                  name="nombre_completo"
                  value={formData.nombre_completo}
                  onChange={handleChange}
                  placeholder="Ej. Juan Pérez"
                  error={!formData.nombre_completo && formError ? 'Requerido' : undefined}
                />

                <div>
                  <label className="block text-sm font-bold text-dark mb-2 pl-1">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    name="fecha_nacimiento"
                    value={formData.fecha_nacimiento}
                    onChange={handleChange}
                    className="flex h-12 w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-5 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all duration-300"
                  />
                  {!formData.fecha_nacimiento && formError && (
                    <p className="mt-1 text-sm text-red-500 pl-1">Requerido</p>
                  )}
                </div>

                <Select
                  label="Sección"
                  name="seccion"
                  value={formData.seccion}
                  onChange={handleChange}
                  options={SECTION_OPTIONS}
                  placeholder="Selecciona una sección"
                  error={!formData.seccion && formError ? 'Requerido' : undefined}
                />

                {formError && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                    {formError}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleCloseModal}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Guardando...' : 'Guardar'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
