import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import type { ReactElement } from 'react';
import { Toaster } from 'sonner';

import Login from '@/containers/Login';
import Home from '@/containers/Home';

import RouteRestrictor from '@/hocs/RouteRestrcitor';

interface AppRoute {
  path: string;
  element: ReactElement;
  isPrivate: boolean;
}

const appRoutes: AppRoute[] = [
  { path: '/', element: <Login />, isPrivate: false },
  { path: '/home', element: <Home />, isPrivate: true },
];

function App(): ReactElement {
  return (
    <>
      <Toaster richColors />
      <Router>
        <Routes>
          {appRoutes.map(({ path, element, isPrivate }) => (
            <Route
              key={path}
              path={path}
              element={(
                <RouteRestrictor isPrivate={isPrivate}>
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
