import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000', // backend URL
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<
      { accessToken: string; employee: any },
      { email: string; password: string }
    >({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),

    signup: builder.mutation<
      any,
      {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
      }
    >({
      query: (body) => ({
        url: '/auth/signup',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = apiApi;
