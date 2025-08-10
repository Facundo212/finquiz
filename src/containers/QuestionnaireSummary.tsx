import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Check, X } from 'lucide-react';

import { cn } from '@/lib/utils';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { ChartConfig } from '@/components/ui/chart';

import { ExtendedQuestion, useGetQuestionnaireSummaryQuery } from '@/services/questionnaires';

import { QuestionCard } from '@/components/questionCard';
import { ProgressCard } from '@/components/progressCard';
import { ResultsChart } from '@/components/resultsChart';
import { TopicLearningAids } from '@/components/topicLearningAids';
import { PageHeader } from '@/components/pageHeader';

const totalChartConfig = {
  resultado: {
    label: 'Resultado',
    color: 'var(--baby-blue)',
  },
} satisfies ChartConfig;

const topicChartConfig = {
  resultado: {
    label: 'Resultado',
    color: 'var(--coral)',
  },
} satisfies ChartConfig;

function QuestionnaireSummary() {
  const { id: idParam } = useParams();
  const id = Number(idParam);

  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

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

  const totalChartData = useMemo(() => [
    { resultado: data?.stats.total || 0, label: 'Total' },
  ], [data]);

  const topicChartData = useMemo(() => data?.stats.stats_by_topic.map((topic) => (
    { resultado: topic.total, label: topic.topic_name, id: topic.topic_id }
  )), [data]);

  const selectedTopicData = useMemo(() => (
    selectedTopic ? data?.topics.find((topic) => topic.id === selectedTopic) : null
  ), [selectedTopic, data?.topics]);

  const handleSelectTopicBar = (topicId: number) => {
    setSelectedTopic(selectedTopic === topicId ? null : topicId);
  };

  const handleSelectTopicLabel = (label: string) => {
    const clickedTopic = data?.stats.stats_by_topic.find((topic) => topic.topic_name === label);

    if (clickedTopic) {
      handleSelectTopicBar(clickedTopic.topic_id);
    }
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
      <PageHeader navigateBack="/my-questionnaires">
        <h1 className="text-4xl font-bold">Resumen del Cuestionario: {data?.name}</h1>
      </PageHeader>

      <div className="flex gap-12 py-8 transition-all duration-500">
        <ProgressCard questionnaire={data!} hideProgress />
        <div className="w-full">
          <Card className="mb-12 transition-[height] duration-1000 ease-out">
            <CardHeader>
              <CardTitle className="text-2xl">Resultado Total</CardTitle>
            </CardHeader>
            <CardContent>
              <ResultsChart data={totalChartData} chartConfig={totalChartConfig} />

              <hr className="my-4" />

              <div className="mt-4">
                <h3 className="text-2xl font-semibold">Resultados por Tema</h3>
                <p className="text-sm text-muted-foreground mt-2 mb-4">
                  Haz click en un tema para ver materiales de estudio.
                </p>

                <div className="flex flex-row">
                  <ResultsChart
                    data={topicChartData || []}
                    chartConfig={topicChartConfig}
                    onClickBar={(barId) => handleSelectTopicBar(Number(barId))}
                    onClickLabel={(label) => handleSelectTopicLabel(label)}
                  />

                  <div className={cn(
                    'transition-all duration-200 ease-in-out overflow-hidden',
                    selectedTopic ? 'ml-4 w-full opacity-100' : 'w-0 opacity-0',
                  )}>
                    {
                      selectedTopicData && (
                        <>
                          <h4 className="font-semibold">Para repasar</h4>
                          <TopicLearningAids
                            topic={selectedTopicData}
                            className="w-3/4"
                          />
                        </>
                      )
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Accordion type="single" collapsible className="flex flex-col gap-4">
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
    </div>
  );
}

export default QuestionnaireSummary;
