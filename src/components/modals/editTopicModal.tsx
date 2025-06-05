import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

import BaseModal from '@/components/modals/baseModal';
import TopicForm from '@/components/forms/topicForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { useUpdateTopicMutation, useDeleteTopicMutation } from '@/services/api';

interface EditUnitsProps {
  courseId: string;
  unitId: string;
  topic: {
    id: number;
    name: string;
    description: string;
    shortDescription: string;
  }
}

function EditTopicModal({ courseId, unitId, topic }: EditUnitsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updateTopic, {
    isLoading: isLoadingUpdate,
    isSuccess: isSuccessUpdate,
    error: errorUpdate,
  }] = useUpdateTopicMutation();
  const [deleteTopic, {
    isLoading: isLoadingDelete,
    isSuccess: isSuccessDelete,
    error: errorDelete,
  }] = useDeleteTopicMutation();

  useEffect(() => {
    if (isSuccessUpdate) {
      toast.success('Tema actualizado correctamente');
      setIsDialogOpen(false);
    }
  }, [isSuccessUpdate]);

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success('Tema eliminado correctamente');
      setIsDialogOpen(false);
    }
  }, [isSuccessDelete]);

  useEffect(() => {
    if (errorUpdate) {
      if ('status' in errorUpdate) {
        const fetchError = errorUpdate as FetchBaseQueryError;
        const errorMessages = fetchError.data as string[];
        toast.error(errorMessages?.[0] || 'Error al agregar un modificar el tema');
      } else {
        toast.error(errorUpdate.message || 'Error inesperado al modificar el tema');
      }
    }
  }, [errorUpdate]);

  useEffect(() => {
    if (errorDelete) {
      if ('status' in errorDelete) {
        const fetchError = errorDelete as FetchBaseQueryError;
        const errorMessages = fetchError.data as string[];
        toast.error(errorMessages?.[0] || 'Error al eliminar el tema');
      } else {
        toast.error(errorDelete.message || 'Error inesperado al eliminar el tema');
      }
    }
  }, [errorDelete]);

  const handleDelete = async () => {
    await deleteTopic({
      courseId,
      unitId,
      topicId: topic.id.toString(),
    });
  };

  const handleSubmit = async (data: { name: string; description: string, shortDescription: string }) => {
    await updateTopic({
      courseId,
      unitId,
      topicId: topic.id.toString(),
      body: {
        name: data.name,
        description: data.description,
        short_description: data.shortDescription,
      },
    });
  };

  return (
    <BaseModal
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      trigger={(
        <Badge key={topic.id} className="cursor-pointer text-black bg-[#F0B7A4] hover:bg-[#E8A088]">
          {topic.name}
        </Badge>
      )}
      title="Editar Tema"
      description="Modifica los detalles del tema"
    >
      <TopicForm
        onSubmit={handleSubmit}
        isLoading={isLoadingUpdate}
        initialValues={{
          name: topic.name,
          description: topic.description,
          shortDescription: topic.shortDescription,
        }}
        submitButtonText="Actualizar"
        secondaryAction={(
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoadingDelete}
          >
            Eliminar Tema
          </Button>
        )}
      />
    </BaseModal>
  );
}

export default EditTopicModal;
