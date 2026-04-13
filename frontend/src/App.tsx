import './App.css'
import heroImg from './assets/hero.png'
import portadaImg from './assets/portada-web-362.png'
import { useNavigate } from 'react-router-dom'

function App() {
  const navigate = useNavigate()
  return (
    <div className="app-container">
      <header className="header">
        <div className="logo-container">
          <img src={heroImg} alt="Grupo 362 Logo" className="logo" />
          <span className="brand-name">Grupo 362</span>
        </div>
        <nav className="nav-links">
          <a href="#inicio">Inicio</a>
          <a href="#secciones">Secciones</a>
        </nav>
        <div className="header-buttons">
          <button className="btn-portal" onClick={() => navigate('/login')}>Iniciar Sesión</button>
        </div>
      </header>

      <main className="hero-section" style={{ backgroundImage: `url(${portadaImg})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">¡Siempre Listos Para<br />Servir!</h1>
          <p className="hero-subtitle">
            Únete a la gran familia de Guías y Scouts en Cervantes.<br />
            Aventura, valores y amigos para toda la vida.
          </p>
          <button className="btn-cta">¡Inscríbete Ahora!</button>
        </div>
      </main>

      <section id="secciones" className="sections-container">
        <h2 className="sections-title">Nuestras Secciones</h2>
        <div className="cards-wrapper">
          <div className="section-card border-yellow">
            <div className="card-icon">🐺</div>
            <h3 className="card-title">Manada de Lobatos</h3>
            <p className="card-desc">
              Para niños y niñas de 6 a 10 años. ¡Aprende jugando en la selva del Seeonee!
            </p>
          </div>
          <div className="section-card border-green">
            <div className="card-icon">🏕️</div>
            <h3 className="card-title">Tropa Scout</h3>
            <p className="card-desc">
              Para jóvenes de 11 a 14 años. La aventura al aire libre, campamentos y patrullas te esperan.
            </p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src={heroImg} alt="Grupo 362 Logo" className="footer-logo-img" />
            <span className="footer-brand">Grupo 362</span>
          </div>
          <p className="footer-text">
            "Siempre Listos Para Servir". Formando líderes y ciudadanos del mundo a través de valores, aventura y servicio.
          </p>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Grupo 362 Cervantes.</p>
          <div className="footer-links">
            <a href="#facebook">Facebook</a>
            <a href="#instagram">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
