import { useParams } from 'react-router-dom';

import { Spinner } from '@/components/ui/spinner';
import Navbar from '@/components/navbar';
import CourseHero from '@/components/courseHero';
import UnitCard from '@/components/unitCard';

import { useCourseInfoQuery } from '@/services/api';

function Course() {
  const { courseId } = useParams();
  const { data, isLoading, isError } = useCourseInfoQuery({ courseId });

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-theme(space.16))]">
        <h1 className="text-2xl font-bold text-red-500">Error al cargar el curso</h1>
      </div>
    );
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-theme(space.16))]">
          <Spinner size="large" />
        </div>
      </>

    );
  }

  return (
    <>
      <Navbar />
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
          {[...data.course.units]
            .sort((a, b) => a.position - b.position)
            .map((unit) => (
              <UnitCard
                key={unit.id}
                unit={{
                  id: unit.id,
                  name: unit.name,
                  description: unit.description,
                  position: unit.position,
                }}
              />
            ))}
        </div>
      </div>
    </>
  );
}

export default Course;
