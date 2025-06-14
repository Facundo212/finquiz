import { useNavigate } from 'react-router-dom';

import { Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

function CongratulationsCard({ id }: { id: number }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center gap-12 py-12 px-24">
      <Award className="text-yellow-500" size={200} />
      <div className="flex flex-col items-center justify-center gap-4">
        <h2 className="text-lg/8 font-light">¡Felicidades! Has completado el cuestionario.</h2>
        <Button onClick={() => navigate(`/questionnaires/${id}/summary`)}>Ver resultados</Button>
      </div>
    </div>
  );
}

export default CongratulationsCard;
