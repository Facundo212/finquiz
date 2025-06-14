import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { LoaderQuestionnaire } from '@/components/loaderQuestionnaire';
import { ProgressCard } from '@/components/progressCard';

import type { Questionnaire } from '@/services/questionnaires'; // TODO: Make all types be imported like this

import {
  useGetQuestionnaireQuery, useAnswerQuestionMutation, useGetQuestionQuery, useVoteQuestionMutation,
} from '@/services/questionnaires';
import { api } from '@/services/api';

import QuestionSection from './components/questionSection';
import CongratulationsCard from './components/congratulationsCard';

function Questionnaire() {
  const { id: idParam } = useParams();
  const id = Number(idParam);
  const dispatch = useDispatch();

  const [isGenerating, setIsGenerating] = useState(false);

  const {
    data: questionnaireData,
    error: questionnaireError,
    isLoading: questionnaireLoading,
    isSuccess: isQuestionnaireSuccess,
  } = useGetQuestionnaireQuery(id);

  const isFinished = useMemo(
    () => questionnaireData?.questions.length === questionnaireData?.currentPosition,
    [questionnaireData?.currentPosition, questionnaireData?.questions.length],
  );

  const {
    data: questionData,
    error: questionError,
    isLoading: questionLoading,
  } = useGetQuestionQuery({
    questionnaireId: id,
    questionId: questionnaireData?.questions[questionnaireData?.currentPosition]?.id || 0,
  }, {
    skip: !isQuestionnaireSuccess || isFinished,
    pollingInterval: isGenerating ? 10000 : 0,
  });

  useEffect(() => {
    if (questionData) {
      setIsGenerating(questionData.generating);
    }
  }, [questionData]);

  const [answerQuestion] = useAnswerQuestionMutation();

  const advanceAction = () => {
    dispatch(
      // @ts-expect-error - RTK Query types are not properly inferred here
      api.util.updateQueryData('getQuestionnaire', id, (draft: Questionnaire) => {
        draft.currentPosition += 1;
      }),
    );
  };

  const answerQuestionAction = (optionId: number) => (
    answerQuestion({
      questionnaireId: id,
      questionId: questionData!.id,
      answer: optionId,
    })
  );

  const [voteQuestion] = useVoteQuestionMutation();

  const voteQuestionAction = (questionId: number, action: 'up_vote' | 'report') => (
    voteQuestion({
      questionnaireId: id,
      questionId,
      action,
    })
  );

  if (questionnaireError || questionError) {
    return <div>Error</div>;
  }

  if (questionnaireLoading || questionLoading || isGenerating) {
    return <LoaderQuestionnaire />;
  }

  return (
    <div className="p-12 h-full">
      {
        isFinished ? (
          <div className="flex flex-col items-center justify-center gap-4 h-full transition-all duration-500
            ease-in-out transform animate-in fade-in slide-in-from-top-4">
            <CongratulationsCard id={id} />
          </div>
        ) : (
          <div className="flex gap-12 py-8 transition-all duration-500">
            <ProgressCard questionnaire={questionnaireData!} />
            <QuestionSection
              question={questionData!}
              advanceAction={advanceAction}
              answerQuestionAction={answerQuestionAction}
              voteQuestionAction={voteQuestionAction}
            />
          </div>
        )
      }
    </div>
  );
}

export default Questionnaire;
