import { Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

function CongratulationsCard() {
  return (
    <div className="flex flex-col items-center justify-center gap-12 py-12 px-24">
      <Award className="text-yellow-500" size={200} />
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-lg/8 font-light">¡Felicidades! Has completado el cuestionario.</p>
        <Button>Ver resultados</Button>
      </div>
    </div>
  );
}

export default CongratulationsCard;
