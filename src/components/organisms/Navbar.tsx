import { useState, useEffect } from 'react';
import { NavLink } from '../molecules/NavLink';
import { Button } from '../atoms/Button';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary tracking-tight">
          ⚜️ Grupo 362
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/">Inicio</NavLink>
          <NavLink to="#secciones">Secciones</NavLink>
          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="primary" size="sm">Portal Padres</Button>
            </Link>
            <Link to="/login?role=admin">
              <Button variant="admin" size="sm">Administración</Button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-2xl text-dark"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4 items-center">
              <NavLink to="/">Inicio</NavLink>
              <NavLink to="#secciones">Secciones</NavLink>
              <Link to="/login" className="w-full">
                <Button variant="primary" fullWidth>Portal Padres</Button>
              </Link>
              <Link to="/login?role=admin" className="w-full">
                <Button variant="admin" fullWidth>Administración</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
