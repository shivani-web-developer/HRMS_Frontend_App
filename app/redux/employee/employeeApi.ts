import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Employee {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  phone: string;
  alternativePhone?: string;
  role: string;
  status: string;
  joiningDate: string; // DD-MM-YYYY
  departmentId?: string;
  designationId?: string;
}

export interface CreateEmployeePayload {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  phone: string;
  alternativePhone?: string;
  role: string;
  status: string;
  joiningDate: string; // DD-MM-YYYY (IMPORTANT)
  departmentId?: string;
  designationId?: string;
}

export const employeeApi = createApi({
  reducerPath: 'employeeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL, // e.g. http://localhost:3001
  }),
  tagTypes: ['Employee'],
  endpoints: (builder) => ({
    // ✅ GET ALL
    getEmployees: builder.query<Employee[], void>({
      query: () => '/employee',
      transformResponse: (response: any) => response.data,
      providesTags: ['Employee'],
    }),

    // ✅ GET BY ID
    getEmployeeById: builder.query<Employee, string>({
      query: (id) => `/employee/${id}`,
      transformResponse: (response: any) => response.data,
    }),

    // ✅ CREATE
    createEmployee: builder.mutation<Employee, CreateEmployeePayload>({
      query: (body) => ({
        url: '/employee',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Employee'],
    }),

    // ✅ UPDATE
    updateEmployee: builder.mutation<
      Employee,
      { id: string; body: Partial<CreateEmployeePayload> }
    >({
      query: ({ id, body }) => ({
        url: `/employee/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Employee'],
    }),

    // ✅ DELETE
    deleteEmployee: builder.mutation<void, string>({
      query: (id) => ({
        url: `/employee/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Employee'],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApi;
