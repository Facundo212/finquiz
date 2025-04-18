import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface RouteRestrictorProps {
  children: ReactNode;
  needAuth: boolean;
  allowedRoles: string[];
}

function RouteRestrictor({ children, needAuth, allowedRoles }: RouteRestrictorProps) {
  const token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('role');

  const isAuthenticated = !!token;
  const isAuthorized = allowedRoles.includes(role ?? '');

  if (!isAuthenticated && needAuth) {
    return <Navigate to="/" />;
  }

  if (isAuthenticated && (!needAuth || (needAuth && !isAuthorized))) {
    return <Navigate to={`/courses/${localStorage.getItem('selectedCourseId')}`} />;
  }

  return children;
}

export default RouteRestrictor;
