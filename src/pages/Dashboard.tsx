import { useAuth } from '../context/AuthContext';
import { MainLayout } from '../components/templates/MainLayout';
import { Navigate } from 'react-router-dom';

export const Dashboard = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-12">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 animate-fade-in-up">
           <div>
              <h1 className="text-4xl font-black mb-2 text-dark">¡Bienvenido!</h1>
              <p className="text-gray-500">Usuario: <span className="font-bold text-primary">{user.email}</span> ({user.role})</p>
           </div>
           <div className="bg-accent text-dark px-8 py-4 rounded-full font-black text-xl shadow-lg mt-6 md:mt-0 flex items-center gap-2">
              <span>⭐</span> 550 pts
           </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           
           {/* Progress Card */}
           <div className="bg-white p-8 rounded-[30px] shadow-sm border-l-8 border-secondary hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                <span>🌲</span> Mi Progresión
              </h3>
              <p className="font-bold text-lg mb-2">Nivel Actual: Akela</p>
              <div className="w-full bg-slate-100 rounded-full h-5 mt-2 overflow-hidden shadow-inner">
                 <div className="bg-gradient-to-r from-secondary to-green-300 h-full rounded-full w-3/4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                 </div>
              </div>
              <div className="flex justify-between mt-3 text-sm font-semibold text-gray-500">
                <span>75% completado</span>
                <span>Faltan 250 pts</span>
              </div>
           </div>
           
           {/* Activity Card */}
           <div className="bg-blue-50 p-8 rounded-[30px] shadow-sm border-l-8 border-primary hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                 <span>📅</span> Próxima Actividad
              </h3>
              <p className="text-3xl font-black text-dark mb-1">Sábado 21 Feb</p>
              <p className="text-primary font-medium text-lg">Acantonamiento en el TEC</p>
           </div>

           {/* Notice Card */}
           <div className="bg-yellow-50 p-8 rounded-[30px] shadow-sm border-l-8 border-accent hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                 <span>📢</span> Avisos de Jefatura
              </h3>
              <blockquote className="italic text-gray-700 border-l-4 border-accent pl-4 text-lg">
                 "No olviden traer el uniforme completo para la inspección."
              </blockquote>
              <p className="text-right mt-4 font-bold text-sm text-gray-400">- Akela</p>
           </div>

        </div>

        {/* Badges Section */}
        <section className="mt-12 bg-white p-8 rounded-[30px] shadow-sm">
           <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
             <span>🎖️</span> Mis Insignias
           </h3>
           <div className="flex flex-wrap gap-6">
              {['🌲', '🩹', '🪢', '🔥', '⛺'].map((badge, i) => (
                <div key={i} className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-4xl border-2 border-dashed border-slate-300 hover:scale-110 hover:bg-white hover:border-accent hover:border-solid hover:shadow-lg cursor-help transition-all duration-300">
                  {badge}
                </div>
              ))}
           </div>
        </section>
      </div>
    </MainLayout>
  );
};
