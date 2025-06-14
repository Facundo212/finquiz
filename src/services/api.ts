import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/reducers/store';

export interface ErrorResponse {
  data: {
    data: {
      errors: string[];
    };
  };
  status: number;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const { accessToken, client, uid } = (getState() as RootState).session;

      if (accessToken && client && uid) {
        headers.set('access-token', accessToken);
        headers.set('client', client);
        headers.set('uid', uid);
      }

      return headers;
    },
    responseHandler: async (response) => {
      const { headers } = response;
      const accessToken = headers.get('access-token');
      const client = headers.get('client');
      const uid = headers.get('uid');
      const expiry = headers.get('expiry');

      return {
        data: await response.json(),
        meta: {
          accessToken, client, uid, expiry,
        },
      };
    },
  }),
  tagTypes: ['Course', 'Questionnaire', 'Question'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: 'api/v1/auth/sign_in',
        method: 'POST',
        body,
      }),
      transformResponse: ({ meta, data: { data } }) => {
        const {
          accessToken,
          client,
          uid,
          expiry,
        } = meta || {};
        const {
          name, nickname, email, role, selected_course_id: selectedCourseId,
        } = data || {};
        localStorage.setItem('accessToken', accessToken || '');
        localStorage.setItem('client', client || '');
        localStorage.setItem('uid', uid || '');
        localStorage.setItem('expiry', expiry || '');
        localStorage.setItem('name', name || '');
        localStorage.setItem('email', email || '');
        localStorage.setItem('nickname', nickname || '');
        localStorage.setItem('role', role || '');
        localStorage.setItem('selectedCourseId', selectedCourseId || '');
        return {
          ...meta,
          user: {
            name,
            email,
            nickname,
            role,
            selectedCourseId,
          },
        };
      },
      transformErrorResponse: (error: ErrorResponse): { status: number; data: string[] } => {
        const { data: { data }, status } = error;
        const { errors } = data || {};

        return {
          status,
          data: errors || ['Error al iniciar sesión'],
        };
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'api/v1/auth/sign_out',
        method: 'DELETE',
      }),
      transformResponse: () => {
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        localStorage.removeItem('nickname');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('client');
        localStorage.removeItem('uid');
        localStorage.removeItem('expiry');
        localStorage.removeItem('role');
        localStorage.removeItem('selectedCourseId');
      },
    }),
    courseInfo: builder.query({
      query: ({ courseId }: { courseId: string }) => ({
        url: `api/v1/courses/${courseId}`,
        method: 'GET',
      }),
      providesTags: (_, __, { courseId }) => [{ type: 'Course', id: courseId }],
      transformResponse: ({ data }) => {
        const { id, name, description } = data || {};
        return {
          course: {
            id,
            name,
            description,
            units: data.units.map(
              (unit: {
                id: number;
                name: string;
                description: string;
                position: number;
                topics: {
                  id: number;
                  name: string;
                  description: string;
                  shortDescription: string;
                  notes: string | null | undefined;
                }[];
              }) => ({
                id: unit.id,
                name: unit.name,
                description: unit.description,
                position: unit.position,
                topics: unit.topics.map(
                  (topic: { id: number; name: string, description: string, shortDescription: string, notes?: string | null }) => ({
                    id: topic.id,
                    name: topic.name,
                    description: topic.description,
                    shortDescription: topic.shortDescription,
                    notes: topic.notes ?? '',
                  }),
                ),
              }),
            ),
          },
        };
      },
      transformErrorResponse: (error: ErrorResponse): { status: number; data: string[] } => {
        const { data: { data }, status } = error;
        const { errors } = data || {};

        return {
          status,
          data: errors || ['Error al obtener la información del curso'],
        };
      },
    }),
    createUnit: builder.mutation({
      query: ({ courseId, body }: {
        courseId: string;
        body: { name: string; description: string };
      }) => ({
        url: `api/v1/courses/${courseId}/units`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_, __, { courseId }) => [{ type: 'Course', id: courseId }],
      transformErrorResponse: (error: ErrorResponse): { status: number; data: string[] } => {
        const { data: { data }, status } = error;
        const { errors } = data || {};

        return {
          status,
          data: errors || ['Error al crear la unidad'],
        };
      },
    }),
    updateCourse: builder.mutation({
      query: ({ courseId, body }: {
        courseId: string;
        body: { name?: string; description?: string };
      }) => ({
        url: `api/v1/courses/${courseId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_, __, { courseId }) => [{ type: 'Course', id: courseId }],
      transformErrorResponse: (error: ErrorResponse): { status: number; data: string[] } => {
        const { data: { data }, status } = error;
        const { errors } = data || {};

        return {
          status,
          data: errors || ['Error al actualizar el curso'],
        };
      },
    }),
    updateUnit: builder.mutation({
      query: ({ courseId, unitId, body }: {
        courseId: string;
        unitId: string;
        body: { name?: string; description?: string; position?: number };
      }) => ({
        url: `api/v1/courses/${courseId}/units/${unitId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_, __, { courseId }) => [{ type: 'Course', id: courseId }],
      transformErrorResponse: (error: ErrorResponse): { status: number; data: string[] } => {
        const { data: { data }, status } = error;
        const { errors } = data || {};

        return {
          status,
          data: errors || ['Error al actualizar la unidad'],
        };
      },
    }),
    createTopic: builder.mutation({
      query: ({ courseId, unitId, body }: {
        courseId: string;
        unitId: string;
        body: { name: string; description: string, short_description: string, notes?: string };
      }) => ({
        url: `api/v1/courses/${courseId}/units/${unitId}/topics`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_, __, { courseId }) => [{ type: 'Course', id: courseId }],
      transformErrorResponse: (error: ErrorResponse): { status: number; data: string[] } => {
        const { data: { data }, status } = error;
        const { errors } = data || {};

        return {
          status,
          data: errors || ['Error al crear el tema'],
        };
      },
    }),
    updateTopic: builder.mutation({
      query: ({
        courseId, unitId, topicId, body,
      }: {
        courseId: string;
        unitId: string;
        topicId: string;
        body: { name?: string; description?: string; short_description?: string, notes?: string };
      }) => ({
        url: `api/v1/courses/${courseId}/units/${unitId}/topics/${topicId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_, __, { courseId }) => [{ type: 'Course', id: courseId }],
      transformErrorResponse: (error: ErrorResponse): { status: number; data: string[] } => {
        const { data: { data }, status } = error;
        const { errors } = data || {};

        return {
          status,
          data: errors || ['Error al actualizar el tema'],
        };
      },
    }),
    deleteTopic: builder.mutation({
      query: ({ courseId, unitId, topicId }: {
        courseId: string;
        unitId: string;
        topicId: string;
      }) => ({
        url: `api/v1/courses/${courseId}/units/${unitId}/topics/${topicId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, { courseId }) => [{ type: 'Course', id: courseId }],
      transformErrorResponse: (error: ErrorResponse): { status: number; data: string[] } => {
        const { data: { data }, status } = error;
        const { errors } = data || {};

        return {
          status,
          data: errors || ['Error al eliminar el tema'],
        };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useCourseInfoQuery,
  useCreateUnitMutation,
  useUpdateCourseMutation,
  useUpdateUnitMutation,
  useCreateTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
} = api;
