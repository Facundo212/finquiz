import { useState } from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface UnitCardProps {
  unit: {
    id: number;
    name: string;
    description: string;
    position: number;
  }
}

function UnitCard({ unit }: UnitCardProps) {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected(!isSelected);
  };

  return (
    <Card
      key={unit.id}
      onClick={handleClick}
      className={cn(
        'flex flex-col cursor-pointer transition-colors duration-200',
        isSelected
          ? 'border-primary shadow-[0_0_5px_0] shadow-primary'
          : 'border-primary-foreground'
        ,
      )}
    >
      <CardHeader className="h-70 p-6 grid-rows-6">
        <CardTitle>{unit.name}</CardTitle>
        <CardDescription>{unit.description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
export default UnitCard;
