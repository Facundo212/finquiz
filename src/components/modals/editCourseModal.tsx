import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

import { Button } from '@/components/ui/button';
import BaseModal from '@/components/modals/baseModal';
import EditCourseForm from '@/components/forms/editCourseForm';

import { useUpdateCourseMutation } from '@/services/api';

interface EditCourseModalProps {
  course: {
    id: number;
    name: string;
    description: string;
  };
}

function EditCourseModal({ course: { id, name, description } }: EditCourseModalProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updateCourse, { isLoading, isSuccess, error }] = useUpdateCourseMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success('Curso actualizado correctamente');
      setIsDialogOpen(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      if ('status' in error) {
        const fetchError = error as FetchBaseQueryError;
        const errorMessages = fetchError.data as string[];
        toast.error(errorMessages?.[0] || 'Error al actualizar el curso');
      } else {
        toast.error(error.message || 'Error inesperado al actualizar el curso');
      }
    }
  }, [error]);

  const handleSubmit = async (data: { name: string; description: string }) => {
    await updateCourse({ courseId: id.toString(), body: data });
  };

  return (
    <BaseModal
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      trigger={(
        <Button
          variant="link"
          className="absolute top-4 right-4"
        >
          Editar Curso
        </Button>
      )}
      title="Editar curso"
      description="Modifica la información que verá el estudiante. Una vez listo, selecciona Guardar."
    >
      <EditCourseForm
        initialData={{
          name,
          description,
        }}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </BaseModal>
  );
}

export default EditCourseModal;
