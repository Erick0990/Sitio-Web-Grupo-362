import { useState, type Dispatch, type SetStateAction } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { PawPrint, Tent, Users, Megaphone, Calendar, LogOut } from 'lucide-react';

export type AdminTab = 'manada' | 'tropa' | 'junta' | 'avisos' | 'actividades';

interface SidebarProps {
  activeTab: AdminTab;
  setActiveTab: Dispatch<SetStateAction<AdminTab>>;
}

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const { logout, user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'manada', label: 'Sección de Manada', icon: <PawPrint size={20} /> },
    { id: 'tropa', label: 'Sección de Tropa', icon: <Tent size={20} /> },
    { id: 'junta', label: 'Junta de Grupo', icon: <Users size={20} /> },
    { id: 'avisos', label: 'Avisos', icon: <Megaphone size={20} /> },
    { id: 'actividades', label: 'Actividades', icon: <Calendar size={20} /> },
  ];

  return (
    <motion.aside
      className="bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-2xl z-20 overflow-hidden"
      initial={{ width: 80 }}
      animate={{ width: isExpanded ? 256 : 80 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      onClick={() => setIsExpanded(true)}
    >
      <div className="p-4 border-b border-slate-800 flex flex-col gap-1 min-h-[88px] justify-center">
        <h1 className={`text-xl font-bold tracking-tight text-white flex items-center gap-3 transition-opacity duration-300 ${isExpanded ? 'justify-start' : 'justify-center'}`}>
          <span className="text-2xl shrink-0">⚜️</span>
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="whitespace-nowrap"
              >
                Grupo 362
              </motion.span>
            )}
          </AnimatePresence>
        </h1>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="flex items-center gap-2 bg-slate-800/50 p-2 rounded-lg overflow-hidden"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary border border-primary/30 shrink-0">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400 font-medium truncate" title={user?.email}>{user?.email}</p>
                <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Administrador</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {menuItems?.map((item) => (
          <button
            key={item.id}
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab(item.id);
            }}
            className={`w-full relative flex items-center px-4 py-3 rounded-xl transition-all duration-200 group outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              activeTab === item.id
                ? 'bg-primary text-white shadow-lg shadow-primary/30 font-semibold'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            } ${isExpanded ? 'justify-start space-x-3' : 'justify-center'}`}
            title={!isExpanded ? item.label : undefined}
          >
            {activeTab === item.id && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="flex items-center justify-center w-6 h-6 shrink-0 group-hover:scale-110 transition-transform duration-200">
              {item.icon}
            </span>
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="whitespace-nowrap truncate text-left"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <button
          onClick={(e) => {
            e.stopPropagation();
            logout();
          }}
          className={`w-full flex items-center justify-center px-4 py-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 text-sm font-medium group ${isExpanded ? 'space-x-2' : ''}`}
          title={!isExpanded ? "Cerrar Sesión" : undefined}
        >
          <span className="shrink-0 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
            <LogOut size={20} />
          </span>
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="whitespace-nowrap"
              >
                Cerrar Sesión
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};
