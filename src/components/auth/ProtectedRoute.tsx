import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PendingApprovalScreen } from './PendingApprovalScreen';

interface ProtectedRouteProps {
  allowedRoles?: ('admin' | 'parent')[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, role, status, loading } = useAuth();

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

  // Check Status First - Block pending users globally
  if (status === 'pending') {
    return <PendingApprovalScreen />;
  }

  // If roles are specified, the user must have a role and it must be in the allowed list
  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    // Redirect to their appropriate dashboard if they have a role, or login if they don't
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'parent') return <Navigate to="/dashboard" replace />;

    // Fallback
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
