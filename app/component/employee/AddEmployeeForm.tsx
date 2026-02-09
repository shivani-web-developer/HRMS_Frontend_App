'use client';

import {
  CreateEmployeePayload,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} from '@/app/redux/employee/employeeApi';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface Props {
  open: boolean;
  onClose: () => void;
  employeeId?: string | null;
}

// utils/date.ts
export const toDDMMYYYY = (isoDate: string) => {
  const [year, month, day] = isoDate.split('-');
  return `${day}-${month}-${year}`;
};

export const toYYYYMMDD = (date?: string) => {
  if (!date) return '';

  // Handle ISO string: 2026-02-02T00:00:00.000Z
  if (date.includes('T')) {
    return date.split('T')[0];
  }

  // Already yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  // dd-mm-yyyy → yyyy-mm-dd
  if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
    const [dd, mm, yyyy] = date.split('-');
    return `${yyyy}-${mm}-${dd}`;
  }

  return '';
};

export default function EmployeeForm({ open, onClose, employeeId }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEmployeePayload>();

  const [createEmployee, { isLoading: creating }] =
    useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: updating }] =
    useUpdateEmployeeMutation();

  const isEditMode = !!employeeId;

const { data: employee, isFetching } =
  useGetEmployeeByIdQuery(employeeId!, {
    skip: !employeeId,
    refetchOnMountOrArgChange: true, // 🔥 KEY
  });

console.log("employee",employeeId)
  /* 🔥 PREFILL FORM ON EDIT */
  useEffect(() => {
  if (employee) {
    console.log(employee.joiningDate)
    reset({
      email: employee.email ?? '',
      firstName: employee.firstName ?? '',
      lastName: employee.lastName ?? '',
      phone: employee.phone ?? '',
      alternativePhone: employee.alternativePhone ?? '',
      role: employee.role ?? '',
      status: employee.status ?? '',
      joiningDate: toYYYYMMDD(employee.joiningDate),
    });
  } else {
    reset({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      alternativePhone: '',
      role: '',
      status: '',
      joiningDate: '',
    });
  }
}, [employee, reset]);


  const onSubmit = async (data: CreateEmployeePayload) => {
    try {
      if (isEditMode && employeeId) {
         await updateEmployee({
        id: employeeId,
        body: {...data, joiningDate: toDDMMYYYY(data.joiningDate),},}).unwrap();
        toast.success('Employee updated successfully');
      } else {
        await createEmployee({
          ...data,
          lastName: data.lastName || '',
          joiningDate: toDDMMYYYY(data.joiningDate),
        }).unwrap();

        toast.success('Employee created successfully');
      }

      reset();
      onClose();
    } catch (error) {
      console.log("error=",error)
      toast.error(
        isEditMode ? 'Failed to update employee' : 'Failed to create employee'
      );
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white w-full max-w-lg rounded-md shadow-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-orange-400 px-4 py-2 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {isEditMode ? 'Edit Employee' : 'Add Employee'}
          </h2>
          <button onClick={onClose} className="text-gray-500 text-2xl">
            ×
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 space-y-3 overflow-y-auto max-h-[75vh]"
        >
          {/* Email */}
           <label className="text-sm font-medium">Email <span className='text-red-500'>*</span></label>
          <input
            className="mt-1 border w-full p-2 rounded"
            type='email'
            {...register('email', { required: true })}
            placeholder="Email"
          />

          {/* Password (CREATE ONLY) */}
           <label className="text-sm font-medium">Password <span className='text-red-500'>*</span></label>
          {!isEditMode && (
            <input
              type="password"
              className="mt-1 border w-full p-2 rounded"
              {...register('password', { required: true })}
              placeholder="Password"
            />
          )}

          <label className="text-sm font-medium">First Name <span className='text-red-500'>*</span></label>
          <input
            className="mt-1 border w-full p-2 rounded"
            {...register('firstName', { required: true })}
            placeholder="First Name"
          />
          
           <label className="text-sm font-medium">Last Name </label>
          <input
            className="mt-1 border w-full p-2 rounded"
            {...register('lastName')}
            placeholder="Last Name"
          />
          
          <label className="text-sm font-medium">Contact Number <span className='text-red-500'>*</span></label>
          <input
            className="mt-1 border w-full p-2 rounded"
            type='number'
            {...register('phone', { required: true })}
            placeholder="Phone"
          />

         <label className="text-sm font-medium">Alternative Number</label>
          <input
            className="mt-1 border w-full p-2 rounded"
            type='number'
            {...register('alternativePhone')}
            placeholder="Alternative Phone"
          />

          <label className="text-sm font-medium">Role <span className='text-red-500'>*</span></label>
          <select
            className="mt-1 border w-full p-2 rounded"
            {...register('role', { required: true })}
          >
            <option value="">Select Role</option>
            <option value="ADMIN">Admin</option>
            <option value="HR">HR</option>
            <option value="MANAGER">Manager</option>
            <option value="EMPLOYEE">Employee</option>
          </select>

          <label className="text-sm font-medium">Status <span className='text-red-500'>*</span></label>
          <select
            className="mt-1 border w-full p-2 rounded"
            {...register('status', { required: true })}
          >
            <option value="">Select Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <label className="text-sm font-medium">Joining Date <span className='text-red-500'>*</span></label>
          <input
            type="date"
            disabled={isEditMode}
            className="mt-1 border w-full p-2 rounded disabled:cursor-not-allowed"
            {...register('joiningDate', { required: true })}
          />

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-1 border rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer px-4 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              {creating || updating
                ? 'Saving...'
                : isEditMode
                ? 'Update'
                : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
