import type { ButtonHTMLAttributes, ReactNode, ElementType } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'admin' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
  as?: ElementType; 
  to?: string; 
  href?: string;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  children,
  as: Component = 'button',
  ...props
}: ButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-full font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-lg hover:shadow-xl hover:-translate-y-0.5',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark shadow-lg hover:shadow-xl hover:-translate-y-0.5',
    accent: 'bg-accent text-dark hover:scale-105 shadow-md hover:shadow-lg',
    admin: 'bg-admin-green text-green-900 hover:bg-admin-hover hover:text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:scale-105',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-gray-600 hover:text-primary hover:bg-gray-100',
    destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <Component
      className={cn(baseStyles, variants[variant], sizes[size], widthStyles, className)}
      {...props}
    >
      {children}
    </Component>
  );
};
