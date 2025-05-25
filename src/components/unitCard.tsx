import { useState } from 'react';
import { useSelector } from 'react-redux';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EditUnitModal from '@/components/modals/editUnitModal';
import { cn } from '@/lib/utils';

import { RootState } from '@/reducers/store';
import CreateTopicModal from './modals/createTopicModal';
import EditTopicModal from './modals/editTopicModal';

interface UnitCardProps {
  unit: {
    id: number;
    name: string;
    description: string;
    position: number;
    maxPosition: number;
    courseId: string;
    topics: {
      id: number;
      name: string;
      description: string;
      shortDescription: string;
    }[];
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
      <CardHeader className={cn(
        'p-6 flex flex-col',
        'h-70',
        'overflow-hidden',
      )}>
        <CardTitle>{unit.name}</CardTitle>
        <CardDescription className="line-clamp-5 overflow-hidden text-ellipsis my-2">
          {unit.description}
        </CardDescription>
        <div className="h-20 overflow-y-auto">
          <div className="flex flex-wrap gap-2">
            {userIsTeacher && (
              <CreateTopicModal
                courseId={unit.courseId}
                unitId={unit.id.toString()}
              />
            )}
            {unit.topics.map((topic) => (
              userIsTeacher ? (
                <EditTopicModal
                  key={topic.id}
                  courseId={unit.courseId}
                  unitId={unit.id.toString()}
                  topic={topic}
                />
              ) : (
                <Badge key={topic.id} className="cursor-pointer text-black bg-[#F0B7A4]">
                  {topic.name}
                </Badge>
              )
            ))}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
export default UnitCard;
