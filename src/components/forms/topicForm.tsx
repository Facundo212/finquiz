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
  shortDescription: z.string().min(1, 'La descripción corta es requerida'),
});

interface TopicFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  isLoading?: boolean;
  initialValues?: {
    name?: string;
    description?: string;
    shortDescription?: string;
  };
  submitButtonText?: string;
  secondaryAction?: React.ReactNode;
}

function TopicForm({
  onSubmit,
  isLoading = false,
  initialValues = {},
  submitButtonText = 'Guardar',
  secondaryAction,
}: TopicFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues.name || '',
      description: initialValues.description || '',
      shortDescription: initialValues.shortDescription || '',
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
                    placeholder="Ingrese el nombre del tema"
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
            name="shortDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción Breve</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ingrese una descripción breve del tema, esta descripción sera vista por los estudiantes"
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ingrese la descripción del tema, esta descripción sera utilizada para la generación de preguntas"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            {secondaryAction}
            <Button type="submit" disabled={isLoading || !form.formState.isDirty}>
              {submitButtonText}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

TopicForm.defaultProps = {
  isLoading: false,
  initialValues: {},
  submitButtonText: 'Agregar',
  secondaryAction: undefined,
};

export default TopicForm;
