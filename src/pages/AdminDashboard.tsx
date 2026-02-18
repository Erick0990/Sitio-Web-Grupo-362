import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { TextArea } from '../components/atoms/TextArea';
import { MainLayout } from '../components/templates/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { formatRelativeTime } from '../utils/formatDate';
import { useAnuncios } from '../hooks/useAnuncios';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { anuncios, loading, refetch, setAnuncios } = useAnuncios();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo.trim() || !formData.contenido.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const { error } = await supabase
        .from('anuncios')
        .insert([
          {
            titulo: formData.titulo,
            contenido: formData.contenido,
            user_id: user?.id
          }
        ]);

      if (error) throw error;

      setFormData({ titulo: '', contenido: '' });
      refetch();
    } catch (err) {
      console.error('Error creating anuncio:', err);
      setError('Error al publicar el anuncio');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este anuncio?')) return;

    try {
      const { error } = await supabase
        .from('anuncios')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAnuncios(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Error deleting anuncio:', err);
      alert('Error al eliminar el anuncio');
    }
  };

  return (
    <MainLayout showNavbar={false} showFooter={true} paddingTop={false}>
      <div className="min-h-screen bg-slate-900 p-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-4xl border-t-8 border-accent mt-10"
        >
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🛠️</span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-dark">Panel Administrativo</h1>
                <p className="text-gray-500 text-sm font-medium">Gestión del Grupo 362 - {user?.email}</p>
              </div>
            </div>
            <Button onClick={logout} variant="destructive" size="sm">
              Cerrar Sesión
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna Izquierda: Formulario */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 sticky top-6">
                <h2 className="text-xl font-bold text-dark mb-4">📢 Nuevo Comunicado</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <Input
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    placeholder="Título del anuncio"
                    label="Título"
                    disabled={submitting}
                  />
                  <TextArea
                    name="contenido"
                    value={formData.contenido}
                    onChange={handleInputChange}
                    placeholder="Escribe el contenido aquí..."
                    label="Contenido"
                    rows={5}
                    disabled={submitting}
                  />

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <Button
                    type="submit"
                    variant="admin"
                    fullWidth
                    disabled={submitting}
                  >
                    {submitting ? 'Publicando...' : 'Publicar Anuncio'}
                  </Button>
                </form>
              </div>
            </div>

            {/* Columna Derecha: Lista de Anuncios */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-dark mb-4">Historial de Comunicados</h2>

              {loading ? (
                <div className="text-center py-10 text-gray-400">Cargando anuncios...</div>
              ) : anuncios.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-gray-400">
                  No hay anuncios publicados aún.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <AnimatePresence>
                    {anuncios.map((anuncio) => (
                      <motion.div
                        key={anuncio.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        layout
                        className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-dark">{anuncio.titulo}</h3>
                          <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                            {formatRelativeTime(anuncio.fecha_publicacion)}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm whitespace-pre-wrap line-clamp-3 mb-4">
                          {anuncio.contenido}
                        </p>
                        <div className="flex justify-end pt-2 border-t border-gray-100">
                           <button
                            onClick={() => handleDelete(anuncio.id)}
                            className="text-red-500 text-sm font-medium hover:text-red-700 hover:underline flex items-center gap-1 transition-colors"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};
