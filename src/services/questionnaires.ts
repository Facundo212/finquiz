import { api } from './api';

export interface Topic {
  id: number;
  name: string;
  shortDescription: string;
  learningAids: {
    id: number;
    name: string;
    url: string;
  }[];
}

export interface Question {
  id: number;
  correct?: boolean | null;
  score: number;
}

export interface QuestionOption {
  id: number;
  text: string;
  correct: boolean;
}

export interface ExtendedQuestion extends Question {
  title: string;
  stem: string;
  options: QuestionOption[];
  generating: boolean;
  explanation: string;
  answeredOptionId: number;
  topic: Topic;
  score: number;
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
  isCompleted: boolean;
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

export interface QuestionnaireSummary extends Questionnaire {
  questions: ExtendedQuestion[];
  stats: {
    total: number;
    stats_by_topic: {
      topic_id: number;
      topic_name: string;
      total: number;
    }[];
  };
  topics: Topic[];
}

interface CreateQuestionnaireRequest {
  unit_ids: number[];
}

export interface StudentStats {
  questionnairesCount: number;
  successTopics: Topic[];
  failureTopics: Topic[];
}

export const questionnaireApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createQuestionnaire: builder.mutation<Questionnaire, CreateQuestionnaireRequest>({
      query: ({ unit_ids }) => ({
        url: 'api/v1/questionnaires',
        method: 'POST',
        body: { unit_ids },
      }),
      transformResponse: ({ data }) => data,
    }),
    getQuestionnaires: builder.query<QuestionnaireList, void>({
      query: () => ({
        url: 'api/v1/questionnaires',
      }),
    }),
    getQuestionnaire: builder.query<Questionnaire, number>({
      query: (id) => ({
        url: `api/v1/questionnaires/${id}`,
      }),
      providesTags: (_, __, id) => [{ type: 'Questionnaire', id }],
      transformResponse: ({ data }) => data,
    }),
    getStudentStats: builder.query<StudentStats, void>({
      query: () => ({
        url: 'api/v1/users/stats',
      }),
      transformResponse: ({ data }) => data,
    }),
    getQuestion: builder.query<ExtendedQuestion, { questionnaireId: number, questionId: number }>({
      query: ({ questionnaireId, questionId }) => ({
        url: `api/v1/questionnaires/${questionnaireId}/questions/${questionId}`,
      }),
      providesTags: (_, __, { questionId }) => [{ type: 'Question', id: questionId }],
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
    getQuestionnaireSummary: builder.query<QuestionnaireSummary, number>({
      query: (id) => ({
        url: `api/v1/questionnaires/${id}/summary`,
      }),
      transformResponse: ({ data }) => data,
    }),
    voteQuestion: builder.mutation<ExtendedQuestion, { questionnaireId: number, questionId: number, action: 'up_vote' | 'report' }>({
      query: ({ questionnaireId, questionId, action }) => ({
        url: `api/v1/questionnaires/${questionnaireId}/questions/${questionId}/vote`,
        method: 'POST',
        body: { vote_action: action },
      }),
      transformResponse: ({ data }) => data,
      invalidatesTags: (_, __, { questionnaireId, questionId, action }) => (action === 'report'
        ? [{ type: 'Question', id: questionId }, { type: 'Questionnaire', id: questionnaireId }]
        : [{ type: 'Question', id: questionId }]),
    }),
  }),
});

export const {
  useCreateQuestionnaireMutation,
  useGetQuestionnairesQuery,
  useGetQuestionnaireQuery,
  useGetQuestionQuery,
  useAnswerQuestionMutation,
  useGetQuestionnaireSummaryQuery,
  useGetStudentStatsQuery,
  useVoteQuestionMutation,
} = questionnaireApi;
