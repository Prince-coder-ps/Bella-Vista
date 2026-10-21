import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageLoader from '../components/ui/PageLoader';

export default function AdminRoute() {
  const { isAuthenticated, isAdmin, initializing } = useAuth();

  if (initializing) return <PageLoader />;
  if (!isAuthenticated || !isAdmin) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}
