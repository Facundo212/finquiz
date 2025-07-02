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
  voteQuestionAction,
}: {
  question: ExtendedQuestion;
  advanceAction: () => void;
  answerQuestionAction: (optionId: number) => Promise<
  { data: AnswerQuestionResponse } | { error: FetchBaseQueryError | SerializedError }
  >;
  voteQuestionAction: (
    questionId: number,
    action: 'up_vote' | 'report'
  ) => Promise<{ data: ExtendedQuestion } | { error: FetchBaseQueryError | SerializedError }>;
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

  const handleVoteQuestion = (questionId: number, action: 'up_vote' | 'report') => {
    voteQuestionAction(questionId, action)
      .then((res) => {
        if ('data' in res) {
          if (res.data?.score > 0) {
            toast.info('La pregunta ha sido valorada positivamente');
          } else {
            toast.info('La pregunta ha sido reportada correctamente');
            handleAdvance();
          }
        }
      });
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
        <div className="flex items-center gap-4">
          <Button
            variant="destructive"
            className="w-min px-12 py-6"
            onClick={() => handleVoteQuestion(question.id, 'report')}
            disabled={!!question.score}
          >
            Reportar pregunta
          </Button>

          <Button
            variant="positive"
            className="w-min px-12 py-6"
            onClick={() => handleVoteQuestion(question.id, 'up_vote')}
            disabled={!!question.score}
          >
            Buena pregunta
          </Button>
        </div>

        <Button className="w-min px-12 py-6" onClick={handleAdvance} disabled={!isAnswered}>
          Siguiente
        </Button>
      </div>
    </div>
  );
}

export default QuestionSection;
