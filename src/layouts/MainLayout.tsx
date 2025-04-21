import { Outlet } from 'react-router-dom';

import Navbar from '@/components/navbar';

function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;
