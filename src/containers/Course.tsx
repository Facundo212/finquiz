import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import CourseHero from '@/components/courseHero';
import UnitCard from '@/components/unitCard';
import CreateUnitModal from '@/components/modals/createUnitModal';

import { RootState } from '@/reducers/store';

import { useCourseInfoQuery } from '@/services/api';
import { useCreateQuestionnaireMutation } from '@/services/questionnaires';

interface Unit {
  id: number;
  name: string;
  description: string;
  position: number;
  topics?: {
    id: number;
    name: string;
    description: string;
    shortDescription: string;
    notes?: string;
  }[];
}

function Course() {
  const navigate = useNavigate();
  const [createQuestionnaire, { isLoading: isCreating }] = useCreateQuestionnaireMutation();
  const [selectedUnits, setSelectedUnits] = useState<number[]>([]);
  const { courseId } = useParams();
  const { data, isLoading, isError } = useCourseInfoQuery({ courseId: courseId ?? '' });
  const { user: { role } } = useSelector((state: RootState) => state.session);

  const handleCreateQuestionnaire = async () => {
    try {
      const result = await createQuestionnaire({ unit_ids: selectedUnits }).unwrap();
      navigate(`/questionnaires/${result.id}`);
    } catch {
      toast.error('Error al crear el cuestionario. Por favor, inténtalo de nuevo.');
    }
  };

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
                selected: selectedUnits.includes(unit.id),
                onSelect: () => {
                  setSelectedUnits((prev: number[]) => (prev.includes(unit.id)
                    ? prev.filter((id) => id !== unit.id)
                    : [...prev, unit.id]));
                },
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
        {role === 'student' && (
          <div className="flex justify-center mt-8">
            <Button
              size="lg"
              className="px-8 py-3"
              disabled={selectedUnits.length === 0 || isCreating}
              onClick={handleCreateQuestionnaire}
            >
              {isCreating ? 'Creando...' : 'Crear cuestionario'}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

export default Course;
