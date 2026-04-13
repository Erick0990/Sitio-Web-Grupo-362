import { useNavigate } from 'react-router-dom';
import './login.css';

export default function Login() {
    const navigate = useNavigate();

    return (
        <div className="login-container">
            <div className="login-card">
                <button className="back-link" onClick={() => navigate('/')}>
                    ← Volver al inicio
                </button>
                <h1 className="login-title">Portal Grupo 362</h1>
                <p className="login-subtitle">Ingresa tus credenciales para continuar</p>

                <form className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input type="email" id="email" placeholder="tu@email.com" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" id="password" placeholder="••••••••" />
                    </div>

                    <button type="button" className="login-submit">
                        Entrar al Sistema
                    </button>
                </form>

                <div className="login-footer">
                    ¿No tienes cuenta? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Regístrate aquí</a>
                    <br />
                    <br />
                    ¿Olvidaste tu contraseña? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/forgotpassword'); }}>Recuperar contraseña</a>
                </div>
            </div>
        </div>
    );
}
