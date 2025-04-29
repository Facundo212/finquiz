import type { ReactElement } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

import RouteRestrictor from '@/hocs/RouteRestrictor';
import Login from '@/containers/Login';
import NotFound from '@/containers/NotFound';
import Course from '@/containers/Course';
import Questionnaire from '@/containers/questionnaire/index';

import MainLayout from './layouts/MainLayout';

interface AppRoute {
  path: string;
  element: ReactElement;
  needAuth: boolean;
  allowedRoles: string[];
  useLayout: boolean;
}

const appRoutes: AppRoute[] = [
  {
    path: '/', element: <Login />, needAuth: false, allowedRoles: ['student', 'teacher'], useLayout: false,
  },
  {
    path: '/courses/:courseId', element: <Course />, needAuth: true, allowedRoles: ['student', 'teacher'], useLayout: true,
  },
  {
    path: '/questionnaires/:id', element: <Questionnaire />, needAuth: true, allowedRoles: ['student', 'teacher'], useLayout: true,
  },
  {
    path: '*', element: <NotFound />, needAuth: true, allowedRoles: ['student', 'teacher'], useLayout: true,
  },
];

function App(): ReactElement {
  const routesWithLayout = appRoutes.filter((route) => route.useLayout);
  const routesWithoutLayout = appRoutes.filter((route) => !route.useLayout);

  return (
    <>
      <Toaster richColors />
      <Router>
        <Routes>
          {routesWithoutLayout.map(({
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

          <Route element={<MainLayout />}>
            {routesWithLayout.map(({ path, element, needAuth, allowedRoles }) => (
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
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
