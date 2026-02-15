import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { MainLayout } from '../components/templates/MainLayout';
import { useSearchParams, Link } from 'react-router-dom';

export const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get('role') === 'admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    // Mock validation
    login(email, isAdmin ? 'admin' : 'user');
  };

  return (
    <MainLayout showNavbar={false} showFooter={false} className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary to-secondary p-6" paddingTop={false}>
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md animate-fade-in-up">
        <Link to="/" className="inline-block mb-6 text-gray-400 hover:text-primary transition-colors text-sm font-semibold">
          ← Volver al inicio
        </Link>
        <h2 className={`text-3xl font-bold mb-2 text-center ${isAdmin ? 'text-green-600' : 'text-primary'}`}>
          {isAdmin ? 'Portal Administrativo' : 'Portal Grupo 362'}
        </h2>
        <p className="text-gray-500 text-center mb-8">Ingresa tus credenciales para continuar</p>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center border border-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant={isAdmin ? 'admin' : 'primary'}
            size="lg"
          >
            Entrar al Sistema
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          ¿No tienes cuenta? <a href="#" className="text-primary font-bold hover:underline">Contacta a tu dirigente</a>
        </div>
      </div>
    </MainLayout>
  );
};
