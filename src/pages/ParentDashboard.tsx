import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/atoms/Button';
import { MainLayout } from '../components/templates/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { formatRelativeTime } from '../utils/formatDate';

interface Anuncio {
  id: string;
  titulo: string;
  contenido: string;
  fecha_publicacion: string;
  user_id: string;
}

export const ParentDashboard = () => {
  const { user, logout } = useAuth();
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnuncios = async () => {
      try {
        const { data, error } = await supabase
          .from('anuncios')
          .select('*')
          .order('fecha_publicacion', { ascending: false });

        if (error) {
          console.error('Error fetching announcements:', error);
        } else {
          setAnuncios(data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnuncios();
  }, []);

  return (
    <MainLayout showNavbar={false} showFooter={true} paddingTop={false}>
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl mt-10"
        >
          {/* Header Card */}
          <div className="bg-white p-8 rounded-3xl shadow-xl text-center mb-8 border-t-8 border-primary relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/5 rounded-tr-full -ml-8 -mb-8" />

            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
              <span className="text-3xl">⚜️</span>
            </div>

            <h1 className="text-2xl font-bold text-dark mb-1 relative z-10">Bienvenido, {user?.email}</h1>
            <p className="text-gray-500 mb-6 text-sm relative z-10">Panel de Padres y Madres - Grupo 362</p>

            <Button onClick={logout} variant="outline" size="sm" className="relative z-10">
              Cerrar Sesión
            </Button>
          </div>

          {/* Announcements Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
              <span className="text-2xl">📢</span> Últimos Avisos
            </h2>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse h-32" />
                ))}
              </div>
            ) : anuncios.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500">
                <p>No hay anuncios publicados por el momento.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence>
                  {anuncios.map((anuncio, index) => (
                    <motion.div
                      key={anuncio.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-3 border-b border-gray-50 pb-3">
                        <h3 className="font-bold text-xl text-primary">{anuncio.titulo}</h3>
                        <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full whitespace-nowrap ml-2">
                          {formatRelativeTime(anuncio.fecha_publicacion)}
                        </span>
                      </div>

                      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                        {anuncio.contenido}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};
