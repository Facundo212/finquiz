import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import DEFAULT_COURSE_ID from '@/constants';

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
    return <Navigate to={`/courses/${DEFAULT_COURSE_ID}`} />;
  }

  return children;
}

export default RouteRestrictor;
