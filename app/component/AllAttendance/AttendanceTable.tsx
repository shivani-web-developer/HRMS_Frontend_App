'use client';

import { useState, useMemo } from 'react';
import { AttendanceRecord, Employee } from '../../allAttendance/page';
import { AttendanceLegend } from '../attendance/AttendanceLegend';

interface AttendanceTableProps {
  employees: Employee[];
  records: AttendanceRecord[];
  fromDate: string; // dd-mm-yyyy OR yyyy-mm-dd
  toDate: string;   // dd-mm-yyyy OR yyyy-mm-dd
}

const PAGE_SIZE = 10;

/* ---------------- DATE HELPERS (FIXED) ---------------- */

function parseDate(dateStr: string) {
  // dd-mm-yyyy
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const [dd, mm, yyyy] = dateStr.split('-').map(Number);
    return new Date(yyyy, mm - 1, dd);
  }

  // yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [yyyy, mm, dd] = dateStr.split('-').map(Number);
    return new Date(yyyy, mm - 1, dd);
  }

  return new Date(NaN);
}

function formatYYYYMMDD(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getDateRange(from: string, to: string) {
  const dates: string[] = [];

  let current = parseDate(from);
  const end = parseDate(to);

  if (isNaN(current.getTime()) || isNaN(end.getTime())) {
    console.error('Invalid date range:', from, to);
    return [];
  }

  current.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  while (current <= end) {
    dates.push(formatYYYYMMDD(new Date(current)));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/* ---------------- COMPONENT ---------------- */

export function AttendanceTable({
  employees,
  records,
  fromDate,
  toDate,
}: AttendanceTableProps) {
  const [page, setPage] = useState(1);

  const days = useMemo(
    () => getDateRange(fromDate, toDate),
    [fromDate, toDate]
  );

  const totalPages = Math.ceil(employees.length / PAGE_SIZE);

  const paginatedEmployees = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return employees.slice(start, start + PAGE_SIZE);
  }, [page, employees]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function getAttendance(empId: string, date: string) {
    return records.find(
      (r) => r.employeeId === empId && r.punchDate === date
    );
  }

  return (
    <>
      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-4 mb-2">
        <span className="text-sm text-gray-600">
          Showing {(page - 1) * PAGE_SIZE + 1}–
          {Math.min(page * PAGE_SIZE, employees.length)} of{' '}
          {employees.length} employees
        </span>
         <div className="flex items-center gap-1">
    {/* Previous */}
    <button
      className="px-2 py-1 border rounded cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      disabled={page === 1}
      onClick={() => setPage(page - 1)}
    >
      ‹
    </button>

    {/* Page Numbers */}
    {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
      const pageNumber = i + 1;
      return (
        <button
          key={pageNumber}
          onClick={() => setPage(pageNumber)}
          className={`px-3 py-1 border rounded ${
            page === pageNumber
              ? 'bg-orange-500 text-white'
              : 'bg-white'
          }`}
        >
          {pageNumber}
        </button>
      );
    })}

    {totalPages > 5 && (
      <>
        <span className="px-2">…</span>
        <button
          className={`px-3 py-1 border rounded ${
            page === totalPages
              ? 'bg-orange-500 text-white'
              : 'bg-white'
          }`}
          onClick={() => setPage(totalPages)}
        >
          {totalPages}
        </button>
      </>
    )}

    {/* Next */}
    <button
      className="px-2 py-1 border rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={page === totalPages}
      onClick={() => setPage(page + 1)}
    >
      ›
    </button>
  </div>
</div>

      <AttendanceLegend />

      {/* TABLE */}
      <div className="relative overflow-x-auto mt-2 rounded">
        <table
          className="w-full text-sm"
          style={{ tableLayout: 'fixed', minWidth: '1200px' }}
        >
          <thead className="relative">
            <tr>
              <th className="sticky left-0 z-30 w-[120px] border p-2 bg-orange-500 shadow-[inset_-1px_0_0_#000]">
                Emp ID
              </th>
              <th className="sticky left-[120px] z-30 w-[220px] border p-2 bg-orange-500 shadow-[inset_-1px_0_0_#000]">
                Employee
              </th>
              <th className="sticky left-[340px] z-30 w-[180px] border p-2 bg-orange-500 shadow-[inset_-1px_0_0_#000]">
                Department
              </th>

              {days.map((d) => (
                <th key={d} className="border p-2 w-[48px] text-center bg-orange-500">
                  {d.split('-')[2]}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
      {paginatedEmployees.length === 0 ? (
     <tr>
    <td
      className="border px-2 py-4 text-center"
      colSpan={days.length + 3}  // ✅ dynamic colspan
    >
      No records found
    </td>
     </tr>
     ) : (
    paginatedEmployees.map((emp, idx) => (
    <tr
      key={emp.id}
      className={idx % 2 === 0 ? 'bg-white' : 'bg-orange-200'}
      style={{ height: '56px' }}
    >
      {/* Emp ID */}
      <td className={`${idx % 2 === 0 ? 'bg-white' : 'bg-orange-200'} sticky left-0 z-20  border text-center shadow-[inset_-1px_0_0_#000] font-medium`}>
        {emp.employeeCode}
      </td>

      {/* Employee */}
      <td className={` ${idx % 2 === 0 ? 'bg-white' : 'bg-orange-200'} sticky left-[120px] z-20 border text-center shadow-[inset_-1px_0_0_#000]`}>
        <div className="font-semibold">
          {emp.firstName} {emp.lastName}
        </div>
        <div className="text-xs text-gray-600">
          {emp.designation || '-'}
        </div>
      </td>

      {/* Department */}
      <td className={` ${idx % 2 === 0 ? 'bg-white' : 'bg-orange-200'} sticky left-[340px] z-20 border text-center shadow-[inset_-1px_0_0_#000]`}>
        {emp.department || '-'}
      </td>

      {/* Attendance Cells */}
      {days.map((date) => {
        const record = getAttendance(emp.id, date);
        const cellDate = new Date(date);

        let status = '';
        if (record) {
          status = record.status;
        } else if (cellDate <= today) {
          status = 'ABSENT';
        }

        return (
          <td key={date} className="border text-center">
            {status && (
              <span
                className={`px-2 py-1 rounded text-xs font-bold ${
                  status === 'PRESENT'
                    ? 'bg-green-400 text-green-950'
                    : status === 'LATE'
                    ? 'bg-yellow-500 text-orange-900'
                    : status === 'LEAVE'
                    ? 'bg-yellow-300'
                    : 'bg-red-400 text-red-900'
                }`}
              >
                {status[0]}
              </span>
            )}
          </td>
        );
      })}
    </tr>
  ))
)}

          </tbody>
        </table>
      </div>
    </>
  );
}
