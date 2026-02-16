import type { ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SectionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  variant?: 'manada' | 'tropa';
  className?: string;
  onClick?: () => void;
}

export const SectionCard = ({
  title,
  description,
  icon,
  variant = 'manada',
  className,
  onClick,
}: SectionCardProps) => {
  const variantStyles = {
    manada: 'border-accent shadow-[0_10px_30px_rgba(255,204,0,0.1)] hover:shadow-[0_25px_50px_rgba(255,204,0,0.2)]',
    tropa: 'border-secondary shadow-[0_10px_30px_rgba(76,175,80,0.1)] hover:shadow-[0_25px_50px_rgba(76,175,80,0.2)]',
  };

  const bgStyles = {
    manada: 'bg-accent',
    tropa: 'bg-secondary',
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative bg-white p-8 pt-12 rounded-[40px] border border-slate-100 overflow-hidden text-center cursor-pointer",
        className,
        variantStyles[variant]
      )}
      onClick={onClick}
    >
      <div className={cn("absolute top-0 left-0 w-full h-2", bgStyles[variant])} />
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-3 text-dark">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
};
