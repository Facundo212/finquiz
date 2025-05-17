import { useState, useMemo, useEffect } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Markdown from 'react-markdown';

import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

import { ExtendedQuestion, AnswerQuestionResponse } from '@/services/questionnaires';

function QuestionCard({
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

  const answerStatusColors = useMemo(() => question.options.map((_option, idx) => {
    if (isCorrect[idx] === true) return 'shadow-green-700 shadow-[0_0_15px] transition-shadow duration-500';
    if (isCorrect[idx] === false) return 'shadow-red-700 shadow-[0_0_15px] transition-shadow duration-500';

    return '';
  }), [isCorrect, question.options]);

  const stemCode = (props: any) => {
    const {
      children, className, node, ...rest
    } = props;
    const match = /language-(\w+)/.exec(className || '');

    return match ? (
      <SyntaxHighlighter
        PreTag="div"
        children={String(children).replace(/\n$/, '')}
        language={match[1]}
        style={oneLight}
        lineProps={{style: {wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}}
        wrapLines
      />
    ) : (
      <code {...rest} className={(className)}>
        {children}
      </code>
    );
  };

  const stemParagraph = (props: any) => {
    const { children, ...rest } = props;

    return (
      <p
        className="prose-code:bg-gray-100 prose-code:rounded-md prose-code:p-1 prose-code:text-sm"
        {...rest}
      >
        {children}
      </p>
    );
  };

  return (
    <div className="flex flex-col gap-12 grow">
      <Card>
        <CardContent>
          <Markdown components={{ code: stemCode, p: stemParagraph }}>{question.stem}</Markdown>
        </CardContent>
      </Card>

      {
        question.options.map((option, idx) => (
          <button
            type="button"
            key={option.id}
            className="w-full text-left border-0 p-0 bg-transparent cursor-pointer disabled:cursor-not-allowed"
            onClick={() => handleAnswerQuestion(option.id, idx)}
            disabled={isAnswered}
          >
            <Card className={cn(
              'transition-all duration-1000',
              answerStatusColors[idx],
              isCorrect[idx] === undefined && isAnswered && 'bg-gray-300 opacity-50',
            )}>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center text-3xl font-bold">
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <p>{option.text}</p>
                </div>
              </CardContent>
            </Card>
          </button>
        ))
      }

      {
        explanation && (
          <div className="transition-all duration-300 ease-in-out transform animate-in fade-in slide-in-from-top-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-bold cursor-pointer">Explicación</AccordionTrigger>
                <AccordionContent className="prose-code:bg-gray-100 prose-code:rounded-md prose-code:p-1 prose-code:text-xs prose-code:before:content-none prose-code:after:content-none prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4 prose-li:my-1 prose-ul:list-disc prose-ul:pl-6 prose-ul:my-2 prose-p:my-4">
                  <Markdown>{explanation}</Markdown>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )
      }

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

export default QuestionCard;
