import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-dark text-white py-12 px-6 text-center mt-20">
      <div className="container mx-auto">
        <Link to="/" className="text-2xl font-bold mb-4 block">⚜️ Grupo 362</Link>
        <p className="text-gray-400 text-sm max-w-lg mx-auto">
          "Siempre Listos Para Servir". Formando líderes y ciudadanos del mundo a través de valores, aventura y servicio.
        </p>
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Grupo 362 Cervantes.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Facebook</a>
            <a href="#" className="hover:text-primary transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
