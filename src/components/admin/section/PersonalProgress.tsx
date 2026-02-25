import { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import type { ScoutSection, Progress, ProgressType } from '../../../types/database';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';

interface PersonalProgressProps {
  section: ScoutSection;
  scoutId: string | null;
}

const ETAPAS_MANADA = ['Pata tierna', 'Saltador(a)', 'Rastreador(a)', 'Cazador(a)'];
const ETAPAS_TROPA = ['Aventurero', 'Intrépido', 'Pionero', 'Explorador'];
const BRUJULAS_TROPA = ['Bronce', 'Plata', 'Oro', 'Platino'];
const PERCENTAGES = [0, 25, 50, 75, 100];

export const PersonalProgress = ({ section, scoutId }: PersonalProgressProps) => {
  const [progressData, setProgressData] = useState<Progress[]>([]);
  const [newSpecialty, setNewSpecialty] = useState('');

  useEffect(() => {
    if (scoutId) {
      fetchProgress();
    } else {
      setProgressData([]);
    }
  }, [scoutId]);

  const fetchProgress = async () => {
    if (!scoutId) return;
    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('scout_id', scoutId);

    if (error) {
      console.error('Error fetching progress:', error);
    } else {
      setProgressData(data || []);
    }
  };

  const handleUpdate = async (type: ProgressType, name: string, percentage: number) => {
    if (!scoutId) return;

    // Optimistic update
    const existing = progressData.find(p => p.type === type && p.name === name);
    const optimisticData = existing
      ? progressData.map(p => p.id === existing.id ? { ...p, percentage: percentage as any } : p)
      : [...progressData, {
          id: 'temp',
          scout_id: scoutId,
          type,
          name,
          percentage: percentage as any,
          last_updated_by: '',
          updated_at: new Date().toISOString()
        }];

    setProgressData(optimisticData);

    // DB Update
    // Check if exists really to get ID or just upsert?
    // Upsert needs ID or constraint. Constraint is likely just PK.
    // So we need to find ID.

    let error;
    if (existing) {
       const { error: updateError } = await supabase
         .from('progress')
         .update({ percentage, updated_at: new Date().toISOString() })
         .eq('id', existing.id);
       error = updateError;
    } else {
       const { error: insertError, data: inserted } = await supabase
         .from('progress')
         .insert([{
           scout_id: scoutId,
           type,
           name,
           percentage
         }])
         .select()
         .single();

       error = insertError;
       if (inserted) {
         // Update temp ID with real ID
         fetchProgress(); // lazy reload to get ID
       }
    }

    if (error) {
      console.error('Error updating progress:', error);
      alert('Error actualizando progreso');
      fetchProgress(); // Revert
    }
  };

  const handleAddSpecialty = async () => {
    if (!newSpecialty.trim() || !scoutId) return;
    await handleUpdate('especialidad', newSpecialty.trim(), 0);
    setNewSpecialty('');
  };

  if (!scoutId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
        <span className="text-4xl mb-2">👈</span>
        <p>Selecciona un protagonista de la lista para gestionar su avance.</p>
      </div>
    );
  }

  const stages = section === 'manada' ? ETAPAS_MANADA : ETAPAS_TROPA;

  return (
    <div className="space-y-6 h-full overflow-y-auto pr-2 custom-scrollbar">

      {/* SECTION 1: ETAPAS */}
      <div>
        <h4 className="font-bold text-slate-800 mb-3 border-b pb-2">Etapas de Progresión</h4>
        <div className="space-y-4">
          {stages.map(stageName => {
            const current = progressData.find(p => p.type === 'etapa' && p.name === stageName);
            const percentage = current ? current.percentage : 0;

            return (
              <div key={stageName} className="flex items-center justify-between gap-4 bg-slate-50 p-3 rounded-lg">
                <span className="font-medium text-slate-700 w-1/3">{stageName}</span>
                <div className="flex-1 flex gap-1">
                  {PERCENTAGES.map(pct => (
                    <button
                      key={pct}
                      onClick={() => handleUpdate('etapa', stageName, pct)}
                      className={`flex-1 text-xs py-1 rounded transition-colors border ${
                        percentage === pct
                          ? 'bg-primary text-white border-primary font-bold'
                          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: BRUJULAS (TROPA ONLY) */}
      {section === 'tropa' && (
        <div>
          <h4 className="font-bold text-slate-800 mb-3 border-b pb-2 mt-6">Brújulas</h4>
          <div className="space-y-4">
            {BRUJULAS_TROPA.map(compassName => {
              // Storing as 'etapa' but named "Brújula Bronce" to distinguish?
              // Or just "Bronce"? Wait, stages might overlap? No.
              // I'll prefix with "Brújula " to be safe or just use the name if unique.
              // "Bronce" is unique enough.
              // Let's use the exact name from the array.
              // However, prompt said "Selectores para... Brújulas".
              // I will assume I should store them.
              // To avoid collision with potential stage names (unlikely), strict naming is key.
              // I will use "Brújula {Name}" for clarity in DB if needed, but UI shows "Bronce".
              // Let's stick to simple names first. "Bronce", "Plata"...

              const dbName = `Brújula ${compassName}`;
              const p = progressData.find(p => p.type === 'etapa' && p.name === dbName);
              const val = p ? p.percentage : 0;

              return (
                <div key={compassName} className="flex items-center justify-between gap-4 bg-slate-50 p-3 rounded-lg">
                  <span className="font-medium text-slate-700 w-1/3 flex items-center gap-2">
                    <span>🧭</span> {compassName}
                  </span>
                  <div className="flex-1 flex gap-1">
                    {PERCENTAGES.map(pct => (
                      <button
                        key={pct}
                        onClick={() => handleUpdate('etapa', dbName, pct)}
                        className={`flex-1 text-xs py-1 rounded transition-colors border ${
                          val === pct
                            ? 'bg-amber-500 text-white border-amber-600 font-bold'
                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: ESPECIALIDADES */}
      <div>
        <h4 className="font-bold text-slate-800 mb-3 border-b pb-2 mt-6">Especialidades</h4>

        {/* List Existing */}
        <div className="space-y-2 mb-4">
          {progressData
            .filter(p => p.type === 'especialidad')
            .map(spec => (
              <div key={spec.id} className="flex items-center justify-between gap-2 bg-blue-50/50 p-2 rounded border border-blue-100">
                <span className="text-sm font-medium text-blue-900">{spec.name}</span>
                <div className="flex gap-1">
                   {PERCENTAGES.map(pct => (
                    <button
                      key={pct}
                      onClick={() => handleUpdate('especialidad', spec.name, pct)}
                      className={`w-8 text-[10px] py-0.5 rounded transition-colors border ${
                        spec.percentage === pct
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-blue-400 border-blue-200 hover:bg-blue-50'
                      }`}
                    >
                      {pct}
                    </button>
                  ))}
                </div>
              </div>
          ))}
          {progressData.filter(p => p.type === 'especialidad').length === 0 && (
            <p className="text-xs text-gray-400 italic">No hay especialidades asignadas.</p>
          )}
        </div>

        {/* Add New */}
        <div className="flex gap-2">
          <Input
            placeholder="Nueva especialidad (ej. Cocina)"
            value={newSpecialty}
            onChange={(e) => setNewSpecialty(e.target.value)}
            className="h-9 text-sm"
          />
          <Button size="sm" onClick={handleAddSpecialty} disabled={!newSpecialty.trim()}>
            +
          </Button>
        </div>
      </div>

    </div>
  );
};
