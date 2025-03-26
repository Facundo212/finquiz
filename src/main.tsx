import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router';

import { store } from '@/reducers/store';

import App from './App';

import Counter from '@/containers/counter';
import Pokemon from '@/containers/pokemon/index';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />

          <Route path="counter" element={<Counter />} />
          <Route path="pokemon/:id" element={<Pokemon />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
