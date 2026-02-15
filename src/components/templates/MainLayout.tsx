import { ReactNode } from 'react';
import { Navbar } from '../organisms/Navbar';
import { Footer } from '../organisms/Footer';
import { clsx } from 'clsx';

interface MainLayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
  className?: string;
  paddingTop?: boolean;
}

export const MainLayout = ({
  children,
  showNavbar = true,
  showFooter = true,
  className,
  paddingTop = true,
}: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen font-sans text-dark bg-slate-50">
      {showNavbar && <Navbar />}
      <main
        className={clsx(
          "flex-grow",
          paddingTop && "pt-[80px]", // Default padding for fixed navbar
          className
        )}
      >
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};
