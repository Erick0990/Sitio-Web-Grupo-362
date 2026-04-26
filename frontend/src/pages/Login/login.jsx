import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/apiAuth';
import '../../css/login.css';

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError('Por favor, ingresa correo y contraseña.');
            return;
        }

        setLoading(true);
        try {
            const data = await loginUser(email, password);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            if (data.user.rol === 'administrador') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.error || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <button className="back-link" onClick={() => navigate('/')}>
                    ← Volver al inicio
                </button>
                <h1 className="login-title">Portal Grupo 362</h1>
                <p className="login-subtitle">Ingresa tus credenciales para continuar</p>

                {error && <div className="error-message" style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

                <form className="login-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="login-submit" disabled={loading}>
                        {loading ? 'Ingresando...' : 'Entrar al Sistema'}
                    </button>
                </form>

                <div className="login-footer">
                    ¿Olvidaste tu contraseña? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/forgotpassword'); }}>Recuperar contraseña</a>
                </div>
            </div>
        </div>
    );
}
