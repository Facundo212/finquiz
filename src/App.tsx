import type { ReactElement } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

import Login from '@/containers/Login';
import NotFound from '@/containers/NotFound';
import Course from '@/containers/Course';
import MyQuestionnaires from '@/containers/MyQuestionnaires';
import Questionnaire from '@/containers/questionnaire';
import QuestionnaireSummary from '@/containers/QuestionnaireSummary';

import RouteRestrictor from '@/hocs/RouteRestrictor';
import MainLayout from '@/layouts/MainLayout';

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
    path: '/my-questionnaires', element: <MyQuestionnaires />, needAuth: true, allowedRoles: ['student'], useLayout: true,
  },
  {
    path: '/questionnaires/:id/summary', element: <QuestionnaireSummary />, needAuth: true, allowedRoles: ['student'], useLayout: true,
  },
  {
    path: '*', element: <NotFound />, needAuth: true, allowedRoles: ['student', 'teacher'], useLayout: true,
  },
];

function App(): ReactElement {
  const routesWithLayout = appRoutes.filter(({ useLayout }) => useLayout);
  const routesWithoutLayout = appRoutes.filter(({ useLayout }) => !useLayout);

  const renderRoute = ({
    path, element, needAuth, allowedRoles,
  }: AppRoute) => (
    <Route
      key={path}
      path={path}
      element={(
        <RouteRestrictor needAuth={needAuth} allowedRoles={allowedRoles}>
          {element}
        </RouteRestrictor>
      )}
    />
  );

  return (
    <>
      <Toaster richColors />
      <Router>
        <Routes>
          {routesWithoutLayout.map(renderRoute)}
          <Route element={<MainLayout />}>
            {routesWithLayout.map(renderRoute)}
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
