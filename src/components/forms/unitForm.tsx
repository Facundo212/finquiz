import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  position: z.number().min(1, 'La posición debe ser mayor o igual a 1').optional(),
});

interface UnitFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  isLoading?: boolean;
  initialValues?: {
    name?: string;
    description?: string;
    position?: number;
    maxPosition?: number;
  };
  submitButtonText?: string;
}

function UnitForm({
  onSubmit,
  isLoading = false,
  initialValues = {},
  submitButtonText = 'Guardar',
}: UnitFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues.name || '',
      description: initialValues.description || '',
      position: initialValues.position ?? (initialValues.maxPosition ?? 0) + 1,
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Ingrese el nombre de la Unidad"
                    autoComplete="off"
                    autoFocus={false}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ingrese la descripción de la Unidad"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Posición</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={
                      initialValues.position
                        ? initialValues.maxPosition ?? 1
                        : (initialValues.maxPosition ?? 0) + 1
                    }
                    value={field.value}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading || !form.formState.isDirty}>
              {submitButtonText}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

UnitForm.defaultProps = {
  isLoading: false,
  initialValues: {},
  submitButtonText: 'Guardar',
};

export default UnitForm;
