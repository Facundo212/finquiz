import { useState, useMemo } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Trash2 } from 'lucide-react';

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
import { Checkbox } from '@/components/ui/checkbox';
import PrerequisiteTopicsManager from '@/components/prerequisiteTopicsManager';
import { cn } from '@/lib/utils';

interface Topic {
  id: number;
  name: string;
  description: string;
  shortDescription: string;
  notes?: string;
  prerequisiteTopicIds?: number[];
  questionTypes?: string[];
  learningAids?: Array<{ id?: number; name: string; url: string, _destroy?: boolean }>;
}

// Question types constants with Spanish labels
const QUESTION_TYPES = [
  { value: 'correct_output', label: 'Salida Correcta' },
  { value: 'fill_in_the_blank', label: 'Relleno de Espacios en Blanco' },
  { value: 'code_analysis', label: 'Análisis de Código' },
  { value: 'recall', label: 'Teórica' },
];

const learningAidSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'El nombre es requerido'),
  url: z.string().url('Debe ser una URL válida').min(1, 'La URL es requerida'),
  _destroy: z.boolean().optional(),
});

const formSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  shortDescription: z.string().min(1, 'La descripción corta es requerida'),
  notes: z.string().default(''),
  questionTypes: z.array(z.string()).default([]),
  learningAids: z.array(learningAidSchema).default([]),
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
    questionTypes?: string[];
    learningAids?: Array<{ id?: number; name: string; url: string, _destroy?: boolean }>;
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
      learningAids: initialValues.learningAids || [],
      questionTypes: initialValues.questionTypes || [],
    },
  });

  const addLearningAid = () => {
    const currentLearningAids = form.getValues('learningAids');
    form.setValue('learningAids', [...currentLearningAids, { name: '', url: '' }]);
  };

  const removeLearningAid = (index: number) => {
    const currentLearningAids = form.getValues('learningAids');
    currentLearningAids[index] = { ...currentLearningAids[index], _destroy: true };
    form.setValue('learningAids', currentLearningAids, { shouldDirty: true });
  };

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
    <div className="flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
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

          <FormField
            control={form.control}
            name="questionTypes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipos de Pregunta Soportadas</FormLabel>
                <div className="space-y-4 mt-3">
                  {QUESTION_TYPES.map((questionType) => (
                    <div key={questionType.value} className="flex items-center space-x-3">
                      <Checkbox
                        id={questionType.value}
                        checked={field.value?.includes(questionType.value)}
                        onCheckedChange={(checked: boolean) => {
                          const updatedValue = checked
                            ? [...(field.value || []), questionType.value]
                            : (field.value || []).filter((value) => value !== questionType.value);
                          field.onChange(updatedValue);
                        }}
                      />
                      <label
                        htmlFor={questionType.value}
                        className={cn(
                          'text-sm font-normal leading-none text-muted-foreground cursor-pointer',
                          'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                        )}
                      >
                        {questionType.label}
                      </label>
                    </div>
                  ))}
                </div>
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
          <div className="space-y-4">
            <FormLabel className="text-base font-medium">Materiales</FormLabel>

            {form.watch('learningAids').map((aid, index) => (
              <div key={aid.id || index} className={`flex gap-2 items-start p-4 border rounded-lg ${aid._destroy ? 'hidden' : ''}`}>
                <div className="flex-1 space-y-4">
                  <FormField
                    control={form.control}
                    name={`learningAids.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Nombre</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej: Diapositivas de la clase"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`learningAids.${index}.url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej: https://eva.fing.edu.uy"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLearningAid(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLearningAid}
              disabled={isLoading}
            >
              + Material
            </Button>
          </div>

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
