import { useMemo } from 'react';
import { Check, X } from 'lucide-react';
import Markdown from 'react-markdown';

import { cn } from '@/lib/utils';
import { QuestionOption } from '@/services/questionnaires';

import { Card, CardContent } from './ui/card';

interface OptionButtonProps {
  option: QuestionOption;
  handleAnswerQuestion: (optionId: number) => void;
  isAnswered: boolean;
  isCorrect: boolean;
  optionLetter: string;
}

function OptionButton({
  option, handleAnswerQuestion, isAnswered, isCorrect, optionLetter,
}: OptionButtonProps) {
  const processedText = useMemo(() => {
    const hasTrailingBlank = /(?: |\u00A0)$/.test(option.text);
    if (hasTrailingBlank) {
      return option.text.replace(/(?: |\u00A0)+$/, (match) => match.split('').map(() => '⎵').join(''));
    }
    return option.text;
  }, [option.text]);

  const answerStatusColors = useMemo(() => {
    if (isCorrect === true) return 'border-2 border-green-700 bg-green-50';
    if (isCorrect === false) return 'border-2 border-red-700 bg-red-50';

    return '';
  }, [isCorrect]);

  const answerStatusBackground = useMemo(() => {
    if (isCorrect === undefined && isAnswered) return 'bg-gray-300 opacity-50';

    return '';
  }, [isCorrect, isAnswered]);

  const answerStatusIcon = useMemo(() => {
    if (isCorrect === true) return <Check className="w-6 h-6 text-green-700" />;
    if (isCorrect === false) return <X className="w-6 h-6 text-red-700" />;

    return null;
  }, [isCorrect]);

  return (
    <button
      type="button"
      key={option.id}
      className="w-full text-left border-0 p-0 bg-transparent cursor-pointer disabled:cursor-not-allowed"
      onClick={() => handleAnswerQuestion(option.id)}
      disabled={isAnswered}
    >
      <Card className={cn('border-2 transition-all duration-1000', answerStatusColors, answerStatusBackground)}>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center text-3xl font-bold">
              {optionLetter}
            </div>
            <div className="whitespace-pre-line">
              <Markdown>{processedText}</Markdown>
            </div>
            {answerStatusIcon}
          </div>
        </CardContent>
      </Card>
    </button>
  );
}

export { OptionButton };
