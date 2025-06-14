import { useState, useEffect } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { toast } from 'sonner';

import { ExtendedQuestion, AnswerQuestionResponse } from '@/services/questionnaires';

import { Button } from '@/components/ui/button';
import { QuestionCard } from '@/components/questionCard';

function QuestionSection({
  question,
  advanceAction,
  answerQuestionAction,
}: {
  question: ExtendedQuestion;
  advanceAction: () => void;
  answerQuestionAction: (optionId: number) => Promise<{ data: AnswerQuestionResponse } | { error: FetchBaseQueryError | SerializedError }>;
}) {
  const [isCorrect, setIsCorrect] = useState<Record<number, boolean>>({});
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [explanation, setExplanation] = useState<string>('');

  const handleAnswerQuestion = (optionId: number, idx: number) => {
    answerQuestionAction(optionId)
      .then((res) => {
        if ('data' in res) {
          setIsAnswered(true);
          setIsCorrect(() => ({ [idx]: res.data?.correct ?? false }));
          setExplanation(res.data?.explanation ?? '');
        }
      })
      .catch(() => {
        toast.error('Error al responder la pregunta');
      });
  };

  const handleAdvance = () => {
    advanceAction();
    setIsAnswered(false);
    setIsCorrect({});
    setExplanation('');
  };

  useEffect(() => {
    if (!isAnswered) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isAnswered]);

  return (
    <div className="flex flex-col gap-12 grow">
      <QuestionCard
        question={question}
        handleAnswerQuestion={handleAnswerQuestion}
        isAnswered={isAnswered}
        isCorrect={isCorrect}
        explanation={explanation}
      />

      <div className="flex items-center justify-between">
        <Button variant="destructive" className="w-min px-12 py-6">
          Reportar
        </Button>

        <Button className="w-min px-12 py-6" onClick={handleAdvance} disabled={!isAnswered}>
          Siguiente
        </Button>
      </div>
    </div>
  );
}

export default QuestionSection;
