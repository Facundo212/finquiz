import { useSelector } from 'react-redux';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EditUnitModal from '@/components/modals/editUnitModal';
import UnitInfoModal from '@/components/modals/unitInfoModal';
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
      notes?: string;
    }[];
    selected: boolean;
    onSelect: () => void;
  }
}

function UnitCard({ unit }: UnitCardProps) {
  const { user: { role } } = useSelector((state: RootState) => state.session);

  const userIsStudent = role === 'student';
  const userIsTeacher = role === 'teacher';

  const handleClick = (e: React.MouseEvent) => {
    // Check if the click is on the info button, dialog close button, overlay, or their children
    const target = e.target as HTMLElement;
    if (
      target.closest('[data-info-button]')
      || target.closest('[data-slot="dialog-close"]')
      || target.closest('[data-slot="dialog-content"]')
      || target.closest('[data-slot="dialog-overlay"]')
    ) {
      return; // Don't select the unit if clicking modal-related elements
    }

    if (userIsStudent) {
      unit.onSelect();
    }
  };

  return (
    <Card
      key={unit.id}
      onClick={handleClick}
      className={cn(
        'flex flex-col transition-colors duration-200 relative',
        userIsStudent ? 'cursor-pointer hover:bg-muted/50' : '',
        unit.selected
          ? 'border-primary shadow-[0_0_5px_0] shadow-primary'
          : 'border-primary-foreground'
        ,
      )}
    >
      {userIsTeacher && <EditUnitModal unit={unit} />}
      {userIsStudent && <UnitInfoModal unit={unit} />}
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
                <Badge key={topic.id} variant="defaultTopic">
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
