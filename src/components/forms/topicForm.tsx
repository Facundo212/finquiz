import { useState, useMemo } from 'react';
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
import PrerequisiteTopicsManager from '@/components/prerequisiteTopicsManager';

interface Topic {
  id: number;
  name: string;
  description: string;
  shortDescription: string;
  notes?: string;
  prerequisiteTopicIds?: number[];
}

const formSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  shortDescription: z.string().min(1, 'La descripción corta es requerida'),
  notes: z.string().default(''),
});

interface TopicFormProps {
  onSubmit: (data: z.infer<typeof formSchema> & { prerequisiteTopics: Topic[] }) => void;
  isLoading?: boolean;
  initialValues?: {
    name?: string;
    description?: string;
    shortDescription?: string;
    notes?: string;
    prerequisiteTopicIds?: number[];
  };
  submitButtonText?: string;
  secondaryAction?: React.ReactNode;
  allTopics?: Topic[];
  currentTopicId?: number;
}

function TopicForm({
  onSubmit,
  isLoading = false,
  initialValues = {},
  submitButtonText = 'Guardar',
  secondaryAction,
  allTopics = [],
  currentTopicId,
}: TopicFormProps) {
  // Convert initial prerequisite topic IDs to full Topic objects
  const initialPrerequisiteTopics = (initialValues.prerequisiteTopicIds || [])
    .map((id) => allTopics.find((t) => t.id === id))
    .filter((t): t is Topic => t !== undefined);

  const [prerequisiteTopics, setPrerequisiteTopics] = useState<Topic[]>(
    initialPrerequisiteTopics,
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues.name || '',
      description: initialValues.description || '',
      shortDescription: initialValues.shortDescription || '',
      notes: initialValues.notes || '',
    },
  });

  const prerequisiteTopicsChanged = useMemo(() => {
    const initialIds = [...(initialValues.prerequisiteTopicIds || [])].sort();
    const currentIds = [...prerequisiteTopics.map((t) => t.id)].sort();

    if (initialIds.length !== currentIds.length) {
      return true;
    }

    return !initialIds.every((id, index) => id === currentIds[index]);
  }, [prerequisiteTopics, initialValues.prerequisiteTopicIds]);

  // Determine if the form is dirty (either form fields or prerequisite topics changed)
  const isFormDirty = form.formState.isDirty || prerequisiteTopicsChanged;

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit({ ...data, prerequisiteTopics });
  };

  return (
    <div className="flex flex-col gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
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
                    className="h-[100px] resize-none overflow-y-auto"
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
                    className="h-[100px] resize-none overflow-y-auto"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notas</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Las notas aqui escritas seran utilizadas para guiar la generación de preguntas, pero no serán vistas por los estudiantes"
                    className="h-[100px] resize-none overflow-y-auto"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {allTopics.length > 0 && (
            <div className="space-y-2">
              <FormLabel>Temas Previos</FormLabel>
              <PrerequisiteTopicsManager
                allTopics={allTopics}
                selectedTopics={prerequisiteTopics}
                currentTopicId={currentTopicId}
                onChange={setPrerequisiteTopics}
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            {secondaryAction}
            <Button type="submit" disabled={isLoading || !isFormDirty}>
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
