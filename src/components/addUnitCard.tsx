import { Plus } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AddUnitCardProps {
  onClick: () => void;
  className?: string;
}

function AddUnitCard({ onClick, className }: AddUnitCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        'flex items-center justify-center',
        'border-2 border-dashed border-muted-foreground',
        'bg-transparent hover:bg-muted/50',
        'cursor-pointer transition-colors duration-200',
        'min-h-[330px]',
        className,
      )}
    >
      <Plus className="h-12 w-12 text-muted-foreground" />
    </Card>
  );
}

AddUnitCard.defaultProps = {
  className: '',
};

export default AddUnitCard;
