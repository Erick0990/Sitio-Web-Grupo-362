import { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import type { Scout, ScoutSection } from '../../../types/database';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { Select } from '../../atoms/Select';

interface ActiveProtagonistsProps {
  section: ScoutSection;
  selectedScoutId: string | null;
  onSelectScout: (id: string | null) => void;
}

export const ActiveProtagonists = ({ section, selectedScoutId, onSelectScout }: ActiveProtagonistsProps) => {
  const [scouts, setScouts] = useState<Scout[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingScout, setEditingScout] = useState<Scout | null>(null);
  const [editForm, setEditForm] = useState<{ full_name: string; date_of_birth: string; section: ScoutSection }>({
    full_name: '',
    date_of_birth: '',
    section: section
  });

  useEffect(() => {
    fetchScouts();
  }, [section]);

  const fetchScouts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('scouts')
      .select('*')
      .eq('section', section)
      .order('full_name');

    if (error) {
      console.error('Error fetching scouts:', error);
    } else {
      setScouts(data || []);
    }
    setLoading(false);
  };

  const handleEditClick = (scout: Scout, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row selection when clicking edit
    setEditingScout(scout);
    setEditForm({
      full_name: scout.full_name,
      date_of_birth: scout.date_of_birth,
      section: scout.section
    });
  };

  const handleUpdate = async () => {
    if (!editingScout) return;

    const { error } = await supabase
      .from('scouts')
      .update({
        full_name: editForm.full_name, // Typically not edited here but prompt implies section/age correction. Name correction is useful too.
        date_of_birth: editForm.date_of_birth,
        section: editForm.section
      })
      .eq('id', editingScout.id);

    if (error) {
      alert('Error actualizando scout: ' + error.message);
    } else {
      setEditingScout(null);
      fetchScouts();
      // If section changed, the scout disappears from this list.
      if (editForm.section !== section) {
        onSelectScout(null);
      }
    }
  };

  const calculateAge = (dob: string) => {
    const birthday = new Date(dob);
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div>
      {loading ? (
        <div className="text-center py-4 text-gray-400">Cargando protagonistas...</div>
      ) : scouts.length === 0 ? (
        <div className="text-center py-4 text-gray-400 border border-dashed rounded-lg">
          No hay protagonistas registrados en esta sección.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3">Nombre</th>
                <th scope="col" className="px-4 py-3">Edad</th>
                <th scope="col" className="px-4 py-3">Sección</th>
                <th scope="col" className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {scouts.map((scout) => (
                <tr
                  key={scout.id}
                  onClick={() => onSelectScout(scout.id === selectedScoutId ? null : scout.id)}
                  className={`border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedScoutId === scout.id ? 'bg-blue-50 hover:bg-blue-100 border-l-4 border-l-primary' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    {scout.full_name}
                  </td>
                  <td className="px-4 py-3">
                    {calculateAge(scout.date_of_birth)} años
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {scout.section}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => handleEditClick(scout, e)}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal / Inline Edit */}
      {editingScout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-fade-in-up">
            <h3 className="text-lg font-bold mb-4">Editar Protagonista</h3>
            <div className="space-y-4">
              <Input
                label="Nombre Completo"
                value={editForm.full_name}
                onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
              />
              <Input
                type="date"
                label="Fecha de Nacimiento"
                value={editForm.date_of_birth}
                onChange={(e) => setEditForm({...editForm, date_of_birth: e.target.value})}
              />
              <Select
                label="Sección"
                value={editForm.section}
                onChange={(e) => setEditForm({...editForm, section: e.target.value as ScoutSection})}
                options={[
                  { value: 'manada', label: 'Manada' },
                  { value: 'tropa', label: 'Tropa' }
                ]}
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setEditingScout(null)}>Cancel</Button>
              <Button variant="primary" onClick={handleUpdate}>Guardar Cambios</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
