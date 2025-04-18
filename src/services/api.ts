import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/reducers/store';

interface ErrorResponse {
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
      transformResponse: ({ data }) => {
        const { id, name, description } = data || {};
        return {
          course: {
            id,
            name,
            description,
          },
        };
      },
      transformErrorResponse: (error: ErrorResponse): { meta, status: number; data: string[] } => {
        const { data: { data }, status } = error;
        const { errors } = data || {};

        return {
          status,
          data: errors || ['Error al obtener la información del curso'],
        };
      },
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useCourseInfoQuery } = api;
