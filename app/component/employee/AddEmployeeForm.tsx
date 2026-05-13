'use client';

import {
  CreateEmployeePayload,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} from '@/app/redux/employee/employeeApi';
import { useEffect, useState } from 'react';
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
  const [showPassword, setShowPassword] = useState(false);

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
      refetchOnMountOrArgChange: true,
    });

  console.log("employee", employeeId);

  /* 🔥 PREFILL FORM ON EDIT, CLEAR ON ADD */
  useEffect(() => {
    if (isEditMode && employee) {
      console.log(employee.joiningDate);
      reset({
        email: employee.email ?? '',
        firstName: employee.firstName ?? '',
        lastName: employee.lastName ?? '',
        phone: employee.phone ?? '',
        alternativePhone: employee.alternativePhone ?? '',
        role: employee.role ?? '',
        status: employee.status ?? '',
        joiningDate: toYYYYMMDD(employee.joiningDate),
        password: '', // Always empty for edit mode
      });
    } else if (!isEditMode) {
      // Clear form when adding new employee
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
      setShowPassword(false); // Reset password visibility
    }
  }, [employee, reset, isEditMode]);

  // Additional effect to clear form when modal opens in add mode
  useEffect(() => {
    if (open && !employeeId) {
      // Use setTimeout to ensure this runs after any autofill
      setTimeout(() => {
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
        setShowPassword(false);
      }, 0);
    }
  }, [open, employeeId, reset]);

  const onSubmit = async (data: CreateEmployeePayload) => {
    try {
      if (isEditMode && employeeId) {
        // For edit mode, only include password if it's provided
        const updateData: any = {
          ...data,
          joiningDate: toDDMMYYYY(data.joiningDate),
        };
        
        // Remove password if empty (don't update it)
        if (!data.password || data.password.trim() === '') {
          delete updateData.password;
        }
        
        await updateEmployee({
          id: employeeId,
          body: updateData,
        }).unwrap();
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
      console.log("error=", error);
      toast.error(
        isEditMode ? 'Failed to update employee' : 'Failed to create employee'
      );
    }
  };

  console.log("employeeId", employeeId, "employee", employee);
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
          autoComplete="off"
        >
          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email <span className='text-red-500'>*</span></label>
            <input
              className="mt-1 border w-full p-2 rounded"
              type='email'
              autoComplete="new-email"
              {...register('email', { required: true })}
              placeholder="Email"
            />
          </div>

          {/* Password - Required for CREATE, Optional for EDIT */}
          <div>
            <label className="text-sm font-medium">
              Password {!isEditMode && <span className='text-red-500'>*</span>}
              {isEditMode && <span className='text-gray-500 text-xs ml-1'>(Leave empty to keep current password)</span>}
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                className="border w-full p-2 rounded pr-10"
                autoComplete="new-password"
                {...register('password', { required: !isEditMode })}
                placeholder={isEditMode ? "Enter new password to change" : "Password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? (
                  // Eye slash icon (hide)
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  // Eye icon (show)
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">First Name <span className='text-red-500'>*</span></label>
            <input
              className="mt-1 border w-full p-2 rounded"
              {...register('firstName', { required: true })}
              placeholder="First Name"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Last Name </label>
            <input
              className="mt-1 border w-full p-2 rounded"
              {...register('lastName')}
              placeholder="Last Name"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Contact Number <span className='text-red-500'>*</span></label>
            <input
              className="mt-1 border w-full p-2 rounded"
              type='number'
              {...register('phone', { required: true })}
              placeholder="Phone"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Alternative Number</label>
            <input
              className="mt-1 border w-full p-2 rounded"
              type='number'
              {...register('alternativePhone')}
              placeholder="Alternative Phone"
            />
          </div>

          <div>
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
          </div>

          <div>
            <label className="text-sm font-medium">Status <span className='text-red-500'>*</span></label>
            <select
              className="mt-1 border w-full p-2 rounded"
              {...register('status', { required: true })}
            >
              <option value="">Select Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Joining Date <span className='text-red-500'>*</span></label>
            <input
              type="date"
              disabled={isEditMode}
              className="mt-1 border w-full p-2 rounded disabled:cursor-not-allowed"
              {...register('joiningDate', { required: true })}
            />
          </div>

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