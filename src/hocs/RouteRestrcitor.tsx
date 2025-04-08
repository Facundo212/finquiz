import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface RouteRestrcitorProps {
  children: ReactNode;
  isPrivate: boolean;
}

function RouteRestrcitor({ children, isPrivate }: RouteRestrcitorProps) {
  const token = localStorage.getItem('accessToken');

  if (!token && isPrivate) {
    return <Navigate to="/" />;
  }

  if (token && !isPrivate) {
    return <Navigate to="/home" />;
  }

  return children;
}

export default RouteRestrcitor;
