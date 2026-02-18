import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { MainLayout } from '../components/templates/MainLayout';
import { Link, useNavigate } from 'react-router-dom';

export const Login = () => {
  const { login, user, role, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if user is authenticated and has a role
    if (!loading && user && role) {
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }

    // Handle case where user is authenticated but role fetch failed
    if (!loading && user && !role) {
        setError('Error crítico: No se pudo cargar tu perfil. Contacta al administrador.');
        setIsSubmitting(false);
    }

    // Reset submitting state if loading finishes (e.g. error occurred or just finished checking)
    if (!loading) {
        setIsSubmitting(false);
    }
  }, [user, role, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      setIsSubmitting(false);
      return;
    }

    const { error: authError } = await login(email, password);

    if (authError) {
      setError('Credenciales inválidas o error en el servidor.');
      setIsSubmitting(false);
    }
    // If success, the useEffect above will handle redirection or error showing
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-3 text-primary font-medium">Verificando credenciales...</span>
      </div>
    );
  }

  return (
    <MainLayout showNavbar={false} showFooter={false} className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary to-secondary p-6" paddingTop={false}>
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md animate-fade-in-up">
        <Link to="/" className="inline-block mb-6 text-gray-400 hover:text-primary transition-colors text-sm font-semibold">
          ← Volver al inicio
        </Link>
        <h2 className="text-3xl font-bold mb-2 text-center text-primary">
          Portal Grupo 362
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
            variant="primary"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Verificando...' : 'Entrar al Sistema'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          ¿No tienes cuenta? <a href="#" className="text-primary font-bold hover:underline">Contacta a tu dirigente</a>
        </div>
      </div>
    </MainLayout>
  );
};
