import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { isTokenExpired } from '@/lib/utils';

interface RouteRestrictorProps {
  children: ReactNode;
  needAuth: boolean;
  allowedRoles: string[];
}

function RouteRestrictor({ children, needAuth, allowedRoles }: RouteRestrictorProps) {
  const token = localStorage.getItem('accessToken');
  const expiry = localStorage.getItem('expiry');
  const role = localStorage.getItem('role');

  const isAuthenticated = !!token && !isTokenExpired(expiry);
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
