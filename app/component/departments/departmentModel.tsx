'use client';

import DepartmentForm from './departmentForm';

interface Props {
  isEdit: boolean;
  employees: any[];
  department?: any;
  onClose: () => void;
}

export default function DepartmentModal({
  isEdit,
  employees,
  department,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg p-6 relative">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {isEdit ? 'Edit Department' : 'Add Department'}
          </h2>
          <button onClick={onClose} className='text-red-600'>
            X
           </button>
        </div>

        {/* Form */}
        <DepartmentForm
          isEdit={isEdit}
          employees={employees}
          department={department}
        />
      </div>
    </div>
  );
}
