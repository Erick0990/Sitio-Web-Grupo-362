import { MainLayout } from '../components/templates/MainLayout';
import { SectionCard } from '../components/molecules/SectionCard';
import { Button } from '../components/atoms/Button';
import heroImage from '../assets/portada-web-362.png';
import { motion } from 'framer-motion';

export const Home = () => {
  return (
    <MainLayout paddingTop={true}>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/80 mix-blend-multiply z-10" />
          <img 
            src={heroImage} 
            alt="Grupo 362" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 container mx-auto px-6 max-w-4xl pt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black mb-6 drop-shadow-lg tracking-tight leading-tight"
          >
            ¡Siempre Listos Para Servir!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-10 font-light drop-shadow-md opacity-90 max-w-2xl mx-auto"
          >
            Únete a la gran familia de Guías y Scouts en Cervantes. Aventura, valores y amigos para toda la vida.
          </motion.p>
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button variant="accent" size="lg" className="text-xl px-10 py-5 shadow-2xl animate-pulse" as="a" href="#secciones">
              ¡Inscríbete Ahora!
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Secciones */}
      <section id="secciones" className="py-24 bg-slate-50 relative z-10">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-primary tracking-tight">Nuestras Secciones</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <SectionCard 
              title="Manada de Lobatos" 
              description="Para niños y niñas de 6 a 10 años. ¡Aprende jugando en la selva del Seeonee!"
              icon="🐺"
              variant="manada"
            />
            <SectionCard 
              title="Tropa Scout" 
              description="Para jóvenes de 11 a 14 años. La aventura al aire libre, campamentos y patrullas te esperan."
              icon="🏕️"
              variant="tropa"
            />
          </div>
        </div>
      </section>
    </MainLayout>
  );
};
