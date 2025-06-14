import { useParams } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { QuestionCard } from '@/components/questionCard';

import { ExtendedQuestion, useGetQuestionnaireSummaryQuery } from '@/services/questionnaires';
import { ProgressCard } from '@/components/progressCard';
import { Spinner } from '@/components/ui/spinner';

function QuestionnaireSummary() {
  const { id: idParam } = useParams();
  const id = Number(idParam);

  const { data, error, isLoading } = useGetQuestionnaireSummaryQuery(id);

  const questionBorderColor = (question: ExtendedQuestion) => {
    if (question.correct === true) return 'border-2 border-green-700';
    if (question.correct === false) return 'border-2 border-red-700';

    return '';
  };

  const isCorrectObject = (question: ExtendedQuestion) => question.options.reduce((acc, option, idx) => {
    if (option.id === question.answeredOptionId || option.correct) {
      acc[idx] = option.correct;
    }

    return acc;
  }, {} as Record<number, boolean>);

  const answerStatusIcon = (question: ExtendedQuestion) => {
    if (question.correct === true) return <Check className="w-6 h-6 text-green-700" />;
    if (question.correct === false) return <X className="w-6 h-6 text-red-700" />;

    return null;
  };

  if (error) {
    window.location.href = `/questionnaires/${id}`;
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="p-12">
      <div className="flex gap-12 py-8 transition-all duration-500">
        <ProgressCard questionnaire={data!} hideProgress />
        <Accordion type="single" collapsible className="flex flex-col gap-4 w-full">
          {
            data?.questions.map((question, idx) => (
              <AccordionItem
                key={question.id}
                value={question.id.toString()}
                className={cn('rounded-sm border-2 last:border-b-2', questionBorderColor(question))}
              >
                <AccordionTrigger className="py-4 px-6 font-bold text-xl">
                  <div className="flex items-center gap-4">
                    {answerStatusIcon(question)}
                    Pregunta
                    {' '}
                    {idx + 1}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-8">
                  <QuestionCard
                    question={question}
                    isAnswered
                    isCorrect={isCorrectObject(question)}
                    explanation={question.explanation}
                    handleAnswerQuestion={() => {}}
                  />
                </AccordionContent>
              </AccordionItem>
            ))
          }
        </Accordion>
      </div>
    </div>
  );
}

export default QuestionnaireSummary;
