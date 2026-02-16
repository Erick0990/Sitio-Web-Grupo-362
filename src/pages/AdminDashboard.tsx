import { useAuth } from '../context/AuthContext';
import { Button } from '../components/atoms/Button';
import { MainLayout } from '../components/templates/MainLayout';
import { motion } from 'framer-motion';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <MainLayout showNavbar={false} showFooter={true} paddingTop={false}>
      <div className="min-h-screen bg-slate-900 p-6 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-3xl text-center border-t-8 border-accent"
        >
          <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🛠️</span>
          </div>

          <h1 className="text-3xl font-black text-dark mb-2">Panel Administrativo</h1>
          <p className="text-gray-500 mb-8 font-medium">Gestión del Grupo 362 - {user?.email}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="font-bold text-dark mb-1">Usuarios</h3>
              <p className="text-xs text-gray-400">Gestionar miembros y roles</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="font-bold text-dark mb-1">Eventos</h3>
              <p className="text-xs text-gray-400">Calendario de actividades</p>
            </div>
             <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="font-bold text-dark mb-1">Tesorería</h3>
              <p className="text-xs text-gray-400">Pagos y finanzas</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="font-bold text-dark mb-1">Inventario</h3>
              <p className="text-xs text-gray-400">Equipo y materiales</p>
            </div>
          </div>

          <Button onClick={logout} variant="destructive" size="lg">
            Cerrar Sesión de Administrador
          </Button>
        </motion.div>
      </div>
    </MainLayout>
  );
};
