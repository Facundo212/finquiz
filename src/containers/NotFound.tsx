import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import Navbar from '@/components/navbar';

function NotFound() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center gap-4 w-full h-screen py-10">
        <h1 className="text-3xl font-semibold text-center font-sans">404 Not Found</h1>
        <p className="text-lg">La página que estás buscando no existe.</p>
        <Button onClick={handleGoBack}>Volver</Button>
      </div>
    </>
  );
}

export default NotFound;
