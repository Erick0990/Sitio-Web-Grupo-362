import { useState } from 'react';
import type { ScoutSection } from '../../../types/database';
import { ActiveProtagonists } from './ActiveProtagonists';
import { PersonalProgress } from './PersonalProgress';
import { AttendanceControl } from './AttendanceControl';
import { motion } from 'framer-motion';

interface SectionTabProps {
  section: ScoutSection;
}

export const SectionTab = ({ section }: SectionTabProps) => {
  const [selectedScoutId, setSelectedScoutId] = useState<string | null>(null);

  return (
    <div className="p-6 h-full overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-slate-800 capitalize">
          Sección {section}
        </h2>
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold border border-primary/20">
          Gestión Operativa
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Cajita 1: Protagonistas Activos (Full Width on mobile, Left on large screens) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <span>👥</span> Protagonistas Activos
            </h3>
            <span className="text-xs text-slate-400">Selecciona uno para ver su progreso</span>
          </div>
          <div className="p-4">
            <ActiveProtagonists
              section={section}
              selectedScoutId={selectedScoutId}
              onSelectScout={setSelectedScoutId}
            />
          </div>
        </motion.div>

        {/* Cajita 2: Progresiones Personales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
        >
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <span>📈</span> Progresiones Personales
            </h3>
          </div>
          <div className="p-4 flex-1">
            <PersonalProgress
              section={section}
              scoutId={selectedScoutId}
            />
          </div>
        </motion.div>

        {/* Cajita 3: Control de Asistencia */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
        >
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <span>✅</span> Control de Asistencia
            </h3>
          </div>
          <div className="p-4 flex-1">
            <AttendanceControl section={section} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
