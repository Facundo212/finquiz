import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import BaseModal from '@/components/modals/baseModal';
import UnitForm from '@/components/forms/unitForm';

import { useUpdateUnitMutation } from '@/services/api';

interface EditUnitModalProps {
  unit: {
    id: number;
    name: string;
    description: string;
    position: number;
    maxPosition: number;
    courseId: string;
  };
}

function EditUnitModal({
  unit: {
    id, name, description, position, maxPosition, courseId,
  },
}: EditUnitModalProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updateUnit, { isLoading, isSuccess, error }] = useUpdateUnitMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success('Unidad editada correctamente');
      setIsDialogOpen(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      if ('status' in error) {
        const fetchError = error as FetchBaseQueryError;
        const errorMessages = fetchError.data as string[];
        toast.error(errorMessages?.[0] || 'Error al editar la unidad');
      } else {
        toast.error(error.message || 'Error inesperado al editar la unidad');
      }
    }
  }, [error]);

  const handleSubmit = async (data: { name: string; description: string; position?: number }) => {
    await updateUnit({ courseId, unitId: id.toString(), body: data });
  };

  return (
    <BaseModal
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      trigger={(
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
        >
          <Pencil className="w-4 h-4" />
        </Button>
      )}
      title="Editar unidad"
      description="Modifica la información que verá el estudiante. Una vez listo, selecciona Guardar."
    >
      <UnitForm
        initialValues={{
          name,
          description,
          position,
          maxPosition,
        }}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </BaseModal>
  );
}

export default EditUnitModal;
