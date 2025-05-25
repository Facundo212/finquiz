import { api } from './api';

export interface Question {
  id: number;
  correct?: boolean | null;
}

interface QuestionOption {
  id: number;
  text: string;
}

export interface ExtendedQuestion extends Question {
  title: string;
  stem: string;
  options: QuestionOption[];
  generating: boolean;
}

export interface Unit {
  id: number;
  name: string;
  description: string;
  position: number;
}

export interface Questionnaire {
  id: number;
  name: string;
  questions: Question[];
  currentPosition: number;
  createdAt: string;
  result: number;
  units: Unit[];
}

export interface QuestionnaireList {
  data: Questionnaire[];
}

interface AnswerQuestionRequest {
  questionnaireId: number;
  questionId: number;
  answer: number;
}

export interface AnswerQuestionResponse {
  id: number;
  correct: boolean;
  explanation: string;
}

export const questionnaireApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getQuestionnaires: builder.query<QuestionnaireList, void>({
      query: () => ({
        url: 'api/v1/questionnaires',
      }),
    }),
    getQuestionnaire: builder.query<Questionnaire, number>({
      query: (id) => ({
        url: `api/v1/questionnaires/${id}`,
      }),
      transformResponse: ({ data }) => data,
    }),
    getQuestion: builder.query<ExtendedQuestion, { questionnaireId: number, questionId: number }>({
      query: ({ questionnaireId, questionId }) => ({
        url: `api/v1/questionnaires/${questionnaireId}/questions/${questionId}`,
      }),
      transformResponse: ({ data }) => data,
    }),
    answerQuestion: builder.mutation<AnswerQuestionResponse, AnswerQuestionRequest>({
      query: ({ questionnaireId, questionId, answer }) => ({
        url: `api/v1/questionnaires/${questionnaireId}/questions/${questionId}/answer`,
        method: 'POST',
        body: { answer },
      }),
      transformResponse: ({ data }) => data,
      async onQueryStarted({ questionnaireId }, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;

        dispatch(
          // @ts-expect-error - RTK Query types are not properly inferred here
          api.util.updateQueryData('getQuestionnaire', questionnaireId, (draft: Questionnaire) => {
            draft.questions = draft.questions.map((question) => {
              if (question.id === data.id) return { ...question, correct: data.correct };

              return question;
            });
          }),
        );
      },
    }),
  }),
});

export const {
  useGetQuestionnairesQuery,
  useGetQuestionnaireQuery,
  useGetQuestionQuery,
  useAnswerQuestionMutation,
} = questionnaireApi;
