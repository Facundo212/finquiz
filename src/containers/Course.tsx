import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Spinner } from '@/components/ui/spinner';
import CourseHero from '@/components/courseHero';
import UnitCard from '@/components/unitCard';
import CreateUnitModal from '@/components/modals/createUnitModal';

import { RootState } from '@/reducers/store';

import { useCourseInfoQuery } from '@/services/api';

interface Unit {
  id: number;
  name: string;
  description: string;
  position: number;
  topics?: {
    id: number;
    name: string;
  }[];
}

function Course() {
  const { courseId } = useParams();
  const { data, isLoading, isError } = useCourseInfoQuery({ courseId: courseId ?? '' });
  const { user: { role } } = useSelector((state: RootState) => state.session);

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-theme(space.16))]">
        <h1 className="text-2xl font-bold text-red-500">Error al cargar el curso</h1>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-theme(space.16))]">
        <Spinner size="large" />
      </div>
    );
  }

  const units = data?.course.units
    ? [...data.course.units].sort((a: Unit, b: Unit) => a.position - b.position)
    : [];
  const maxPosition = units.length ? units[units.length - 1].position : 0;

  return (
    <>
      {data && (
        <CourseHero
          course={{
            id: data.course.id,
            name: data.course.name,
            description: data.course.description,
          }}
        />
      )}
      <div className="container mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {units.map((unit: Unit) => (
            <UnitCard
              key={unit.id}
              unit={{
                id: unit.id,
                name: unit.name,
                description: unit.description,
                position: unit.position,
                maxPosition,
                courseId: data.course.id,
                topics: unit.topics || [],
              }}
            />
          ))}
          {role === 'teacher' && (
            <CreateUnitModal
              courseId={data.course.id}
              maxPosition={maxPosition}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Course;
