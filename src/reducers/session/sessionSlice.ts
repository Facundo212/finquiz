import { createSlice } from '@reduxjs/toolkit';

export interface SessionState {
  accessToken: string | null;
  client: string | null;
  uid: string | null;
  expiry: string | null;
  user: {
    name: string | null;
    email: string | null;
    nickname: string | null;
    role: string | null;
    selectedCourseId: string | null;
  };
}

const initialState: SessionState = {
  accessToken: localStorage.getItem('accessToken'),
  client: localStorage.getItem('client'),
  uid: localStorage.getItem('uid'),
  expiry: localStorage.getItem('expiry'),
  user: {
    name: localStorage.getItem('name'),
    email: localStorage.getItem('email'),
    nickname: localStorage.getItem('nickname'),
    role: localStorage.getItem('role'),
    selectedCourseId: localStorage.getItem('selectedCourseId'),
  },
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
    clearSession: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('client');
      localStorage.removeItem('uid');
      localStorage.removeItem('expiry');
      localStorage.removeItem('name');
      localStorage.removeItem('email');
      localStorage.removeItem('nickname');
      localStorage.removeItem('role');
      localStorage.removeItem('selectedCourseId');

      return {
        accessToken: null,
        client: null,
        uid: null,
        expiry: null,
        user: {
          name: null,
          email: null,
          nickname: null,
          role: null,
          selectedCourseId: null,
        },
      };
    },
  },
});

export const { setSession, clearSession } = sessionSlice.actions;

export default sessionSlice.reducer;
