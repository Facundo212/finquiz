import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import type { Questionnaire } from '@/services/questionnaires'; // TODO: Make all types be imported like this

import { useGetQuestionnaireQuery, useAnswerQuestionMutation, useGetQuestionQuery } from '@/services/questionnaires';
import { api } from '@/services/api';

import ProgressCard from './components/progressCard';
import QuestionCard from './components/questionCard';
import CongratulationsCard from './components/congratulationsCard';

function Questionnaire() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    data: questionnaireData,
    error: questionnaireError,
    isLoading: questionnaireLoading,
    isSuccess: isQuestionnaireSuccess,
  } = useGetQuestionnaireQuery(Number(id));

  const isFinished = useMemo(
    () => questionnaireData?.questions.length === questionnaireData?.currentPosition,
    [questionnaireData?.currentPosition, questionnaireData?.questions.length],
  );

  const {
    data: questionData,
    error: questionError,
    isLoading: questionLoading,
  } = useGetQuestionQuery({
    questionnaireId: Number(id),
    questionId: questionnaireData?.questions[questionnaireData?.currentPosition]?.id || 0,
  }, {
    skip: !isQuestionnaireSuccess || isFinished,
  });

  const [answerQuestion] = useAnswerQuestionMutation();

  const advanceAction = () => {
    dispatch(
      // @ts-expect-error - RTK Query types are not properly inferred here
      api.util.updateQueryData('getQuestionnaire', Number(id), (draft: Questionnaire) => {
        draft.currentPosition += 1;
      }),
    );
  };

  const answerQuestionAction = (optionId: number) => (
    answerQuestion({
      questionnaireId: Number(id),
      questionId: questionData!.id,
      answer: optionId,
    })
  );

  if (questionnaireError || questionError) {
    return <div>Error</div>;
  }

  if (questionnaireLoading || questionLoading) {
    return <div>Loading</div>;
  }

  return (
    <div className="p-12 h-full">
      <h1 className="text-4xl font-bold">
        Cuestionario:
        {` ${questionnaireData?.name}`}
      </h1>
      {
        isFinished ? (
          <div className="flex flex-col items-center justify-center gap-4 h-full transition-all duration-500
            ease-in-out transform animate-in fade-in slide-in-from-top-4">
            <CongratulationsCard />
          </div>
        ) : (
          <div className="flex gap-12 py-8 transition-all duration-500">
            <ProgressCard questionnaire={questionnaireData!} />
            <QuestionCard question={questionData!} advanceAction={advanceAction} answerQuestionAction={answerQuestionAction} />
          </div>
        )
      }
    </div>
  );
}

export default Questionnaire;
