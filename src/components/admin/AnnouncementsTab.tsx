import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { TextArea } from '../atoms/TextArea';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// Interface matching 'announcements' collection
interface Announcement {
  id: string;
  title: string;
  content: string;
  author_id: string;
  createdAt: any;
  is_active: boolean;
}

export const AnnouncementsTab = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data: Announcement[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Announcement);
      });
      setAnnouncements(data);
    } catch (error: any) {
      console.error('Error fetching announcements:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'announcements'), {
        title: formData.title,
        content: formData.content,
        author_id: user?.id,
        createdAt: serverTimestamp(),
        is_active: true
      });
      setFormData({ title: '', content: '' });
      fetchAnnouncements();
    } catch (error: any) {
      alert('Error publicando anuncio: ' + error.message);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este anuncio?')) return;
    try {
      await deleteDoc(doc(db, 'announcements', id));
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } catch (error: any) {
      alert('Error eliminando: ' + error.message);
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Avisos Generales</h2>
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold border border-primary/20">
          Comunicación
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-0">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
              <span>✍️</span> Redactar Noticia
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Título"
                placeholder="Ej. Reunión de Padres"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
              <TextArea
                label="Contenido"
                placeholder="Escribe los detalles aquí..."
                rows={5}
                value={formData.content}
                onChange={e => setFormData({...formData, content: e.target.value})}
              />
              <Button type="submit" fullWidth disabled={submitting || !formData.title || !formData.content}>
                {submitting ? 'Publicando...' : 'Publicar Anuncio'}
              </Button>
            </form>
          </div>
        </div>

        {/* Lista */}
        <div className="lg:col-span-2">
          <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <span>📢</span> Historial de Enviados
          </h3>

          {loading ? (
            <div className="text-center py-10 text-gray-400">Cargando avisos...</div>
          ) : announcements.length === 0 ? (
             <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400">
               No hay anuncios publicados.
             </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {announcements?.map(anuncio => (
                  <motion.div
                    key={anuncio.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg text-slate-800">{anuncio.title}</h4>
                      <button
                        onClick={() => handleDelete(anuncio.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                    <p className="text-slate-600 text-sm whitespace-pre-wrap mb-3">
                      {anuncio.content}
                    </p>
                    <div className="text-xs text-slate-400 flex justify-between items-center border-t pt-2 border-slate-100">
                      <span>Publicado: {anuncio.createdAt ? new Date(anuncio.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</span>
                      {/* Optional: Show author if needed */}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
