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
});

interface CreateUnitFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  isLoading?: boolean;
}

function CreateUnitForm({ onSubmit, isLoading = false }: CreateUnitFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: 'Mi nueva unidad!',
      description: 'Descripción de la nueva unidad',
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

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              Guardar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

CreateUnitForm.defaultProps = {
  isLoading: false,
};

export default CreateUnitForm;
