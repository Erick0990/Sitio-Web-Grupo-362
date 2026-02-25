import { ParentApproval } from './ParentApproval';
import { FinancialControl } from './FinancialControl';
import { motion } from 'framer-motion';

export const JuntaTab = () => {
  return (
    <div className="p-6 h-full overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Junta de Grupo
        </h2>
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold border border-primary/20">
          Gestión Administrativa
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Cajita 1: Aprobación de Padres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
        >
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <span>👨‍👩‍👧‍👦</span> Aprobación de Padres
            </h3>
          </div>
          <div className="p-4 flex-1">
            <ParentApproval />
          </div>
        </motion.div>

        {/* Cajita 2: Control Financiero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
        >
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <span>💰</span> Control Financiero
            </h3>
          </div>
          <div className="p-4 flex-1">
            <FinancialControl />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
