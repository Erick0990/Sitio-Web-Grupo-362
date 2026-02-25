import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { TextArea } from '../atoms/TextArea';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  created_by: string;
  created_at: string;
}

export const ActivitiesTab = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: ''
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .gte('date', new Date().toISOString()) // Only upcoming? Prompt says "Próximas Actividades".
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching activities:', error);
    } else {
      setActivities(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.location) return;

    setSubmitting(true);

    // Combine date and time
    const dateTime = formData.time ? `${formData.date}T${formData.time}:00` : `${formData.date}T00:00:00`;
    // Ensure ISO string
    const isoDate = new Date(dateTime).toISOString();

    const { error } = await supabase
      .from('activities')
      .insert([{
        title: formData.title,
        description: formData.description,
        date: isoDate,
        location: formData.location,
        created_by: user?.id
      }]);

    if (error) {
      alert('Error creando actividad: ' + error.message);
    } else {
      setFormData({ title: '', description: '', date: '', time: '', location: '' });
      fetchActivities();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta actividad?')) return;
    const { error } = await supabase.from('activities').delete().eq('id', id);
    if (error) {
      alert('Error eliminando: ' + error.message);
    } else {
      setActivities(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Próximas Actividades</h2>
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold border border-primary/20">
          Planificación
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-0">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
              <span>🗓️</span> Nueva Actividad
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nombre de la Actividad"
                placeholder="Ej. Campamento de Verano"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Fecha"
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
                <Input
                  label="Hora"
                  type="time"
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                />
              </div>
              <Input
                label="Lugar"
                placeholder="Ej. Parque Nacional..."
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
              />
              <TextArea
                label="Detalles Adicionales"
                placeholder="Qué llevar, costo, etc..."
                rows={3}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
              <Button type="submit" fullWidth disabled={submitting || !formData.title || !formData.date}>
                {submitting ? 'Guardando...' : 'Agendar Actividad'}
              </Button>
            </form>
          </div>
        </div>

        {/* Lista */}
        <div className="lg:col-span-2">
          <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <span>📅</span> Agenda del Grupo
          </h3>

          {loading ? (
            <div className="text-center py-10 text-gray-400">Cargando actividades...</div>
          ) : activities.length === 0 ? (
             <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400">
               No hay actividades programadas.
             </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {activities.map(activity => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                    <div className="flex justify-between items-start mb-2 pl-2">
                      <div>
                         <h4 className="font-bold text-lg text-slate-800">{activity.title}</h4>
                         <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                           <span className="flex items-center gap-1">📅 {new Date(activity.date).toLocaleDateString()}</span>
                           <span className="flex items-center gap-1">⏰ {new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                           <span className="flex items-center gap-1">📍 {activity.location}</span>
                         </div>
                      </div>
                      <button
                        onClick={() => handleDelete(activity.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                    {activity.description && (
                      <p className="text-slate-600 text-sm mt-3 pl-2 bg-slate-50 p-2 rounded">
                        {activity.description}
                      </p>
                    )}
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
