import { useState } from 'react';
import { useSelector } from 'react-redux';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import EditUnitModal from '@/components/modals/editUnitModal';
import { cn } from '@/lib/utils';

import { RootState } from '@/reducers/store';

interface UnitCardProps {
  unit: {
    id: number;
    name: string;
    description: string;
    position: number;
    maxPosition: number;
    courseId: string;
  }
}

function UnitCard({ unit }: UnitCardProps) {
  const [isSelected, setIsSelected] = useState(false);

  const { user: { role } } = useSelector((state: RootState) => state.session);

  const userIsStudent = role === 'student';
  const userIsTeacher = role === 'teacher';

  const handleClick = () => {
    if (userIsStudent) {
      setIsSelected(!isSelected);
    }
  };

  return (
    <Card
      key={unit.id}
      onClick={handleClick}
      className={cn(
        'flex flex-col transition-colors duration-200 relative',
        userIsStudent ? 'cursor-pointer hover:bg-muted/50' : '',
        isSelected
          ? 'border-primary shadow-[0_0_5px_0] shadow-primary'
          : 'border-primary-foreground'
        ,
      )}
    >
      {userIsTeacher && <EditUnitModal unit={unit} />}
      <CardHeader className="h-70 p-6 grid-rows-6">
        <CardTitle>{unit.name}</CardTitle>
        <CardDescription className="line-clamp-8 overflow-hidden">
          {unit.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
export default UnitCard;
