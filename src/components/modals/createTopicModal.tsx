import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

import BaseModal from '@/components/modals/baseModal';
import TopicForm from '@/components/forms/topicForm';
import { Badge } from '@/components/ui/badge';

import { useCreateTopicMutation, useCourseInfoQuery } from '@/services/api';

interface Topic {
  id: number;
  name: string;
  description: string;
  shortDescription: string;
  notes?: string;
  prerequisiteTopicIds?: number[];
  questionTypes?: string[];
}

interface CreateUnitsProps {
  courseId: string;
  unitId: string;
}

function CreateTopicModal({ courseId, unitId }: CreateUnitsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [createTopic, { isLoading, isSuccess, error }] = useCreateTopicMutation();
  const { data: courseData } = useCourseInfoQuery({ courseId });

  const allTopics: Topic[] = courseData?.course?.units?.reduce((acc: Topic[], unit: { topics: Topic[] }) => [...acc, ...unit.topics], []) || [];

  useEffect(() => {
    if (isSuccess) {
      toast.success('Tema agregado correctamente');
      setIsDialogOpen(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      if ('status' in error) {
        const fetchError = error as FetchBaseQueryError;
        const errorMessages = fetchError.data as string[];
        toast.error(errorMessages?.[0] || 'Error al agregar un nuevo tema');
      } else {
        toast.error(error.message || 'Error inesperado al agregar un nuevo tema');
      }
    }
  }, [error]);

  type LearningAid = { id?: number; name: string; url: string; _destroy?: boolean };
  const handleSubmit = async (data: {
    name: string;
    description: string,
    shortDescription: string,
    notes: string,
    questionTypes: string[],
    prerequisiteTopics: Topic[],
    learningAids: LearningAid[],
  }) => {
    await createTopic({
      courseId,
      unitId,
      body: {
        topic: {
          name: data.name,
          description: data.description,
          short_description: data.shortDescription,
          notes: data.notes,
          prerequisite_topic_ids: data.prerequisiteTopics.map((topic) => topic.id),
          question_types: data.questionTypes,
          learning_aids_attributes: data.learningAids.map((aid) => ({
            id: aid.id,
            name: aid.name,
            url: aid.url,
            _destroy: aid._destroy,
          })),
        },
      },
    });
  };

  return (
    <BaseModal
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      trigger={(
        <Badge
          variant="outline"
          className="cursor-pointer border-dashed border-primary text-primary hover:bg-gray-100 transition-colors"
        >
          + Nuevo Tema
        </Badge>
      )}
      title="Agregar un nuevo tema"
      description="Agrega un nuevo tema a la unidad"
    >
      <TopicForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitButtonText="Agregar"
        allTopics={allTopics}
      />
    </BaseModal>
  );
}

export default CreateTopicModal;
