import type { ReactElement } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

import Login from '@/containers/Login';
import Home from '@/containers/Home';
import NotFound from '@/containers/NotFound';

import RouteRestrictor from '@/hocs/RouteRestrictor';

interface AppRoute {
  path: string;
  element: ReactElement;
  needAuth: boolean;
  allowedRoles: string[];
}

const appRoutes: AppRoute[] = [
  {
    path: '/', element: <Login />, needAuth: false, allowedRoles: ['student', 'teacher'],
  },
  {
    path: '/courses/:id', element: <Home />, needAuth: true, allowedRoles: ['student', 'teacher'],
  },
  {
    path: '*', element: <NotFound />, needAuth: true, allowedRoles: ['student', 'teacher'],
  },
];

function App(): ReactElement {
  return (
    <>
      <Toaster richColors />
      <Router>
        <Routes>
          {appRoutes.map(({
            path, element, needAuth, allowedRoles,
          }) => (
            <Route
              key={path}
              path={path}
              element={(
                <RouteRestrictor needAuth={needAuth} allowedRoles={allowedRoles}>
                  {element}
                </RouteRestrictor>
              )}
            />
          ))}
        </Routes>
      </Router>
    </>
  );
}

export default App;
