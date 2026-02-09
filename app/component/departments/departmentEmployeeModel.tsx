'use client';

import { useState } from 'react';
// import { X } from 'lucide-react';

export default function DepartmentEmployeesModal({
  department,
  onClose,
}: any) {
  const [search, setSearch] = useState('');

  const filtered = department.employees.filter((emp: any) =>
    emp.id.includes(search) ||
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[500px] rounded-lg shadow-lg p-5">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">
            Employees – {department.name}
          </h3>
          <button onClick={onClose}>
            X
          </button>
        </div>

        {/* Search */}
        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Search by ID or Name"
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* List */}
        <div className="max-h-60 overflow-y-auto">
          {filtered.map((emp: any) => (
            <div key={emp.id} className="py-2 border-b">
              <div className="font-medium">
                {emp.firstName} {emp.lastName}
              </div>
              <div className="text-sm text-gray-500">EMP-{emp.id}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
