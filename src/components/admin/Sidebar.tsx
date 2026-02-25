import type { Dispatch, SetStateAction } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

export type AdminTab = 'manada' | 'tropa' | 'junta' | 'avisos' | 'actividades';

interface SidebarProps {
  activeTab: AdminTab;
  setActiveTab: Dispatch<SetStateAction<AdminTab>>;
}

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const { logout, user } = useAuth();

  const menuItems: { id: AdminTab; label: string; icon: string }[] = [
    { id: 'manada', label: 'Manada', icon: '🐺' },
    { id: 'tropa', label: 'Tropa', icon: '⚜️' },
    { id: 'junta', label: 'Junta de Grupo', icon: '👥' },
    { id: 'avisos', label: 'Avisos', icon: '📢' },
    { id: 'actividades', label: 'Próximas Actividades', icon: '📅' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-2xl z-20 overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex flex-col gap-1">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>⚜️</span> Grupo 362
        </h1>
        <div className="flex items-center gap-2 mt-2 bg-slate-800/50 p-2 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary border border-primary/30">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-400 font-medium truncate" title={user?.email}>{user?.email}</p>
            <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Administrador</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              activeTab === item.id
                ? 'bg-primary text-white shadow-lg shadow-primary/30 font-semibold'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {activeTab === item.id && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="text-xl group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 text-sm font-medium group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">🚪</span>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
