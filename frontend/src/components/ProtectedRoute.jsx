import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
        return <Navigate to="/login" replace />;
    }

    const user = JSON.parse(userStr);

    if (requireAdmin && user.rol !== 'administrador') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
