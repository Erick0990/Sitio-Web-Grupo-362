import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: ('admin' | 'parent')[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, the user must have a role and it must be in the allowed list
  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    // Redirect to their appropriate dashboard if they have a role, or login if they don't (shouldn't happen if user is set but role is missing usually implies error or new user not set up)
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'parent') return <Navigate to="/dashboard" replace />;

    // Fallback if no role found but authenticated (e.g. DB error) -> maybe home or login?
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
