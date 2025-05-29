import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { OptionButton } from '@/components/optionButton';

import { ExtendedQuestion } from '@/services/questionnaires';

interface QuestionCardProps {
  question: ExtendedQuestion;
  handleAnswerQuestion: (optionId: number, idx: number) => void;
  isAnswered: boolean;
  isCorrect: Record<number, boolean>;
  explanation: string;
}

function QuestionCard({
  question, handleAnswerQuestion, isAnswered, isCorrect, explanation,
}: QuestionCardProps) {
  /* eslint-disable */
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
        lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
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
  /* eslint-enable */

  return (
    <div className="flex flex-col gap-6 grow">
      <Card>
        <CardContent>
          <Markdown components={{ code: stemCode, p: stemParagraph }}>{question.stem}</Markdown>
        </CardContent>
      </Card>

      {
        question.options.map((option, idx) => (
          <OptionButton
            key={option.id}
            option={option}
            handleAnswerQuestion={(optionId) => handleAnswerQuestion(optionId, idx)}
            isAnswered={isAnswered}
            isCorrect={isCorrect[idx]}
            optionLetter={String.fromCharCode(65 + idx)}
          />
        ))
      }

      {
        explanation && (
          <div className="transition-all duration-300 ease-in-out transform animate-in fade-in slide-in-from-top-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-bold cursor-pointer">Explicación</AccordionTrigger>
                <AccordionContent
                  className="prose-code:bg-gray-100 prose-code:rounded-md prose-code:p-1 prose-code:text-xs prose-code:before:content-none
                    prose-code:after:content-none prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4 prose-li:my-1 prose-ul:list-disc prose-ul:pl-6
                    prose-ul:my-2 prose-p:my-4"
                >
                  <Markdown>{explanation}</Markdown>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )
      }
    </div>
  );
}

export { QuestionCard };
