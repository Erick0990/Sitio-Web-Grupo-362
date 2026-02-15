import { Link } from 'react-router-dom';
import { ReactNode } from 'react';

interface NavLinkProps {
  to: string;
  children: ReactNode;
  active?: boolean;
}

export const NavLink = ({ to, children, active }: NavLinkProps) => {
  return (
    <Link to={to} className="relative text-dark font-semibold text-base transition-colors duration-300 hover:text-primary pb-1 group">
      {children}
      <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${active ? 'w-full' : 'w-0'} group-hover:w-full`} />
    </Link>
  );
};
