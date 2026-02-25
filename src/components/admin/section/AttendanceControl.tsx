import { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import type { Scout, ScoutSection } from '../../../types/database';
import { Input } from '../../atoms/Input';
import { useAuth } from '../../../context/AuthContext';

interface AttendanceControlProps {
  section: ScoutSection;
}

export const AttendanceControl = ({ section }: AttendanceControlProps) => {
  const { user } = useAuth();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [scouts, setScouts] = useState<Scout[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, boolean>>({}); // scoutId -> isPresent
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [section, date]);

  const fetchData = async () => {
    setLoading(true);
    // Fetch scouts
    const { data: scoutsData } = await supabase
      .from('scouts')
      .select('*')
      .eq('section', section)
      .order('full_name');

    // Fetch attendance for date
    const { data: attendanceData } = await supabase
      .from('attendance')
      .select('scout_id, is_present')
      .eq('date', date);

    setScouts(scoutsData || []);

    // Map attendance
    const map: Record<string, boolean> = {};
    if (attendanceData) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      attendanceData.forEach((a: any) => {
        map[a.scout_id] = a.is_present;
      });
    }
    setAttendanceMap(map);
    setLoading(false);
  };

  const toggleAttendance = async (scoutId: string, currentStatus: boolean) => {
    // Optimistic Update
    setAttendanceMap(prev => ({ ...prev, [scoutId]: !currentStatus }));

    try {
      const { data: existing } = await supabase
        .from('attendance')
        .select('id')
        .eq('scout_id', scoutId)
        .eq('date', date)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('attendance')
          .update({
            is_present: !currentStatus,
            recorded_by: user?.id
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('attendance')
          .insert([{
            scout_id: scoutId,
            date: date,
            is_present: !currentStatus,
            recorded_by: user?.id
          }]);
      }
    } catch (err) {
      console.error('Error updating attendance:', err);
      // Revert optimistic update?
      setAttendanceMap(prev => ({ ...prev, [scoutId]: currentStatus }));
      alert('Error al guardar asistencia.');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 bg-white sticky top-0 z-10">
        <Input
          type="date"
          label="Fecha de Asistencia"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar border rounded-xl bg-slate-50">
        {loading ? (
          <div className="flex items-center justify-center h-32 text-gray-400 animate-pulse">
            Cargando asistencia...
          </div>
        ) : scouts.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-400 italic">
            No hay protagonistas en esta sección.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {scouts.map(scout => {
              const isPresent = attendanceMap[scout.id] || false;
              return (
                <div
                  key={scout.id}
                  className={`flex items-center justify-between p-4 transition-colors ${
                    isPresent ? 'bg-green-50/50' : 'hover:bg-white'
                  }`}
                >
                  <span className={`font-medium ${isPresent ? 'text-green-700' : 'text-slate-600'}`}>
                    {scout.full_name}
                  </span>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isPresent}
                      onChange={() => toggleAttendance(scout.id, isPresent)}
                    />
                    <div className={`
                      w-11 h-6 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300
                      transition-colors duration-200 ease-in-out
                      ${isPresent ? 'bg-green-500 after:translate-x-full after:border-white' : 'bg-gray-200 after:border-gray-300'}
                      after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white
                      after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                    `}></div>
                  </label>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
