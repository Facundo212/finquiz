import { useMemo } from 'react';

import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';

import { Questionnaire } from '@/services/questionnaires';
import { Progress } from '@/components/ui/progress';

function ProgressCard({
  questionnaire: {
    name,
    questions,
    currentPosition,
  },
  hideProgress = false,
} : {
  questionnaire: Questionnaire;
  hideProgress?: boolean;
}) {
  const questionStatusColors = useMemo(() => questions.map((question, index) => {
    if (question.correct === true) return 'bg-green-700';
    if (question.correct === false) return 'bg-red-500';
    if (question.correct === null && index < currentPosition) return 'bg-yellow-500';

    return 'border-gray-700';
  }), [questions, currentPosition]);

  const progress = useMemo(
    () => Math.round((currentPosition / questions.length) * 100),
    [currentPosition, questions.length],
  );

  return (
    <Card className="w-3/12 min-w-3/12 h-fit">
      <CardHeader>
        <CardTitle className="text-2xl">{name}</CardTitle>
        {!hideProgress && (
          <CardDescription>
            <Progress value={progress} className="h-4" />
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {questions.map((question, index) => (
          <div key={question.id} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full border-2 ${questionStatusColors[index]} transition-all duration-500`} />
            <p className={`${index === currentPosition ? 'font-medium' : 'font-light'}`}>
              Pregunta
              {' '}
              {index + 1}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export { ProgressCard };
