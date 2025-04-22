import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

import BaseModal from '@/components/modals/baseModal';
import UnitForm from '@/components/forms/unitForm';
import AddUnitCard from '@/components/addUnitCard';

import { useCreateUnitMutation } from '@/services/api';

interface CreateUnitsProps {
  courseId: string;
  maxPosition: number;
}

function CreateUnitModal({ courseId: id, maxPosition }: CreateUnitsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [createUnit, { isLoading, isSuccess, error }] = useCreateUnitMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success('Unidad creada correctamente');
      setIsDialogOpen(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      if ('status' in error) {
        const fetchError = error as FetchBaseQueryError;
        const errorMessages = fetchError.data as string[];
        toast.error(errorMessages?.[0] || 'Error al crear la unidad');
      } else {
        toast.error(error.message || 'Error inesperado al crear la unidad');
      }
    }
  }, [error]);

  const handleSubmit = async (data: { name: string; description: string }) => {
    await createUnit({ courseId: id, body: data });
  };

  return (
    <BaseModal
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      trigger={(
        <AddUnitCard onClick={() => setIsDialogOpen(true)} />
      )}
      title="Crear unidad"
      description="Crea una nueva unidad para el curso. Una vez listo, selecciona Crear."
    >
      <UnitForm
        initialValues={{
          maxPosition,
        }}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitButtonText="Crear"
      />
    </BaseModal>
  );
}

export default CreateUnitModal;
