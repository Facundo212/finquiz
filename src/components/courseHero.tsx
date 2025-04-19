import { useSelector } from 'react-redux';

import { RootState } from '@/reducers/store';
import EditCourseModal from '@/components/modals/editCourseModal';

interface CourseHeroProps {
  course: {
    id: number;
    name: string;
    description: string;
  }
}

function CourseHero({ course: { id, name, description } }: CourseHeroProps) {
  const { user: { role } } = useSelector((state: RootState) => state.session);

  return (
    <div className="w-full py-20 bg-gradient-to-t from-white to-primary-foreground flex flex-col items-center justify-center text-center px-4 relative">
      {role === 'teacher' && (
        <EditCourseModal course={{ id, name, description }} />
      )}

      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">{name}</h1>
        <p className="text-lg font-light text-foreground max-w-3xl">{description}</p>
      </div>
    </div>
  );
}

export default CourseHero;
