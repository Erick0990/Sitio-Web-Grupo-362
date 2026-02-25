import { useAuth } from '../../context/AuthContext';
import { Button } from '../atoms/Button';

export const PendingApprovalScreen = () => {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border-t-4 border-yellow-400">
        <div className="w-20 h-20 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
          ⏳
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Cuenta Pendiente de Aprobación</h1>
        <p className="text-gray-600 mb-6">
          Hola <span className="font-semibold text-gray-800">{user?.email}</span>, tu cuenta ha sido creada exitosamente pero aún requiere aprobación por parte de la Junta de Grupo.
        </p>

        <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm mb-8 text-left">
          <p className="font-bold mb-1">¿Qué sucede ahora?</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Un administrador revisará tu solicitud.</li>
            <li>Una vez aprobado, podrás acceder al panel.</li>
            <li>Si crees que esto es un error, contacta a tu dirigente.</li>
          </ul>
        </div>

        <Button onClick={logout} variant="outline" fullWidth>
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
};
