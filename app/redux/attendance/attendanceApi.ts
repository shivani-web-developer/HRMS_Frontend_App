import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const attendanceApi = createApi({
  reducerPath: 'attendanceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }: any) => {
      const token = getState().auth?.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Attendance'],
  endpoints: (builder) => ({

    getMyAttendance: builder.query<any[], {
      employeeId: string;
      fromDate: string;
      toDate: string;
    }>({
      query: ({ employeeId, fromDate, toDate }) => ({
        url: `/attendance/${employeeId}`,
        params: { fromDate, toDate },
      }),
      providesTags: ['Attendance'],
    }),

    // Get attendance for all employees
    getAllEmployeeAttendance: builder.query<any[], { fromDate: string; toDate: string }>({
      query: ({ fromDate, toDate }) => ({
        url: '/attendance',
        params: { fromDate, toDate },
      }),
      providesTags: ['Attendance'],
    }),

    punchIn: builder.mutation({
      query: (body) => ({
        url: '/attendance/punchIn',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Attendance'],
    }),

    punchOut: builder.mutation({
      query: (body) => ({
        url: '/attendance/punchOut',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Attendance'],
    }),
  }),
});

export const {
  useGetMyAttendanceQuery,
  usePunchInMutation,
  usePunchOutMutation,
  useGetAllEmployeeAttendanceQuery,
} = attendanceApi;
