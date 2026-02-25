import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { MainLayout } from '../components/templates/MainLayout';
import { Link, useNavigate } from 'react-router-dom';

export const Login = () => {
  const { login, signUp, logout, user, role, loading, error: authContextError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
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
  }, [user, role, loading, navigate]);

  // Reset submitting state if global error occurs
  useEffect(() => {
    if (authContextError) {
      setIsSubmitting(false);
    }
  }, [authContextError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    if (!email || !password) {
      setLocalError('Por favor, completa todos los campos.');
      setIsSubmitting(false);
      return;
    }

    try {
      if (isRegistering) {
        const { error, data } = await signUp(email, password);
        if (error) {
           // eslint-disable-next-line @typescript-eslint/no-explicit-any
           setLocalError((error as any).message || 'Error al registrarse.');
           setIsSubmitting(false);
        } else {
           if (data?.session) {
             // Auto-login will be handled by onAuthStateChange
           } else {
             setSuccessMessage('Registro exitoso. Por favor verifica tu correo electrónico para confirmar la cuenta.');
             setIsSubmitting(false);
             setIsRegistering(false); // Switch back to login to show message cleanly or stay? Let's switch back.
           }
        }
      } else {
        // Login
        const { error: authError, role: userRole } = await login(email, password);

        if (authError) {
          setLocalError('Credenciales inválidas o error en el servidor.');
          setIsSubmitting(false);
        } else {
          if (!userRole) {
            // It's possible the role is null because the trigger failed or is slow.
            // But usually fetchProfile retries.
            // If strictly null, maybe we logout.
            // But let's let the effect handle navigation if role appears.
            // If it stays null, the user stays on login?
            // Existing logic logged out. Let's keep it safe.
             logout();
             setLocalError('Su usuario no tiene un perfil asignado en la base de datos.');
             setIsSubmitting(false);
             return;
          }
          // Navigation is handled by useEffect
        }
      }
    } catch {
      setLocalError('Ocurrió un error inesperado.');
      setIsSubmitting(false);
    }
  };

  // Combine local validation errors with auth context errors
  const displayError = localError || authContextError;

  // Disable button if submitting locally or if global loading is active
  const isButtonDisabled = isSubmitting || loading;

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setLocalError('');
    setSuccessMessage('');
    setEmail('');
    setPassword('');
  };

  return (
    <MainLayout showNavbar={false} showFooter={false} className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary to-secondary p-6" paddingTop={false}>
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md animate-fade-in-up">
        <Link to="/" className="inline-block mb-6 text-gray-400 hover:text-primary transition-colors text-sm font-semibold">
          ← Volver al inicio
        </Link>
        <h2 className="text-3xl font-bold mb-2 text-center text-primary">
          {isRegistering ? 'Crear Cuenta' : 'Portal Grupo 362'}
        </h2>
        <p className="text-gray-500 text-center mb-8">
          {isRegistering ? 'Únete a nuestra comunidad scout' : 'Ingresa tus credenciales para continuar'}
        </p>
        
        {successMessage && (
           <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 text-sm text-center border border-green-200 shadow-sm">
             {successMessage}
           </div>
        )}

        {displayError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm text-center border border-red-200 shadow-sm animate-pulse">
            <p className="font-medium mb-2">{displayError}</p>
            {user && !isRegistering && (
              <button
                onClick={() => {
                  logout();
                  setLocalError('');
                }}
                className="text-primary hover:text-primary-dark font-bold underline hover:no-underline transition-all text-xs uppercase tracking-wider cursor-pointer"
              >
                Cerrar Sesión e Intentar de Nuevo
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Correo Electrónico" 
            type="email" 
            placeholder="tu@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />
          <Input 
            label="Contraseña" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
          />
          <Button 
            type="submit" 
            fullWidth 
            variant="primary"
            size="lg"
            disabled={isButtonDisabled}
          >
            {isButtonDisabled ? 'Procesando...' : (isRegistering ? 'Registrarse' : 'Entrar al Sistema')}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
          <button
            type="button"
            onClick={toggleMode}
            className="text-primary font-bold hover:underline ml-1"
          >
            {isRegistering ? 'Inicia Sesión' : 'Regístrate aquí'}
          </button>
        </div>
      </div>
    </MainLayout>
  );
};
