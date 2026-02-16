import { useAuth } from '../context/AuthContext';
import { Button } from '../components/atoms/Button';
import { MainLayout } from '../components/templates/MainLayout';
import { motion } from 'framer-motion';

export const ParentDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <MainLayout showNavbar={false} showFooter={true} paddingTop={false}>
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-2xl text-center"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">⚜️</span>
          </div>

          <h1 className="text-3xl font-bold text-dark mb-2">Bienvenido, {user?.email}</h1>
          <p className="text-gray-500 mb-8">Panel de Padres y Madres - Grupo 362</p>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-blue-800 mb-2">👋 ¡Hola!</h3>
            <p className="text-blue-600 text-sm">
              Esta es tu área personal donde podrás ver el progreso de tus hijos, próximos eventos y comunicados importantes.
              Próximamente encontrarás más funcionalidades aquí.
            </p>
          </div>

          <Button onClick={logout} variant="outline" size="lg">
            Cerrar Sesión
          </Button>
        </motion.div>
      </div>
    </MainLayout>
  );
};
