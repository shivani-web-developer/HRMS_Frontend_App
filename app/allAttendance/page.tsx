'use client';

import { Box } from '@mui/material';
import { useState } from 'react';
import Sidebar from '../component/layout/Sidebar';
import TopBar from '../component/layout/TopBar';
import { AttendanceTable } from '../component/AllAttendance/AttendanceTable';
import {  getCurrentMonthRange } from '../myAttendance/page';
import { formatTime, formatDate } from '../component/AllAttendance/attendanceUtils';

import { useGetAllEmployeeAttendanceQuery } from '../redux/attendance/attendanceApi';

export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  designation: string;
  department: string;
}

export interface AttendanceRecord {
  employeeId: string;
  punchDate: string; // YYYY-MM-DD
  punchIn: string;
  punchOut: string;
  status: string;
}

export default function AttendancePage() {
  const { from, to } = getCurrentMonthRange();
  const [fromDate, setFromDate] = useState(from);
  const [toDate, setToDate] = useState(to);
  const [openForm, setOpenForm] = useState(false);
  const fromDateFormatted = formatDate(new Date(fromDate));
  const toDateFormatted = formatDate(new Date(toDate));

  const { data, isLoading, isError, refetch } =
    useGetAllEmployeeAttendanceQuery({
      fromDate: fromDateFormatted,
      toDate: toDateFormatted,
    });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  /* ✅ Employees */
  const employees: Employee[] =
    data?.map((emp: any) => ({
      id: emp.employeeId,
      employeeCode: emp.employeeCode,
      firstName: emp.name.split(' ')[0],
      lastName: emp.name.split(' ')[1] || '',
      designation: emp.designation || '',
      department: emp.department || '',
    })) || [];

  /* ✅ Attendance records */
  const attendanceRecords: AttendanceRecord[] =
    data?.flatMap((emp: any) =>
      emp.attendances.map((att: any) => ({
        employeeId: emp.employeeId,
        punchDate: att.date.split('T')[0],
        punchIn: att.punchIn ? att.punchIn.split('T')[1].slice(0, 5) : '',
        punchOut: att.punchOut ? att.punchOut.split('T')[1].slice(0, 5) : '',
        status: att.status,
      }))
    ) || [];

  return (
    <Box display="flex" height="100vh" overflow="hidden">
      <Sidebar />

      <Box flex={1} p={3} bgcolor="#f9fafb" overflow="auto">
        <TopBar
          title="My Attendance"
          subtitle="Comprehensive attendance tracking and analysis."
        />

        {/* Date Filters */}
               <div className="flex flex-wrap items-end justify-between gap-4 py-4 ">
  
  {/* LEFT: Date Filters */}
  <div className="flex flex-wrap gap-4">
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium">From date</label>
      <input
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        className="border px-3 py-2 rounded-md min-w-[160px]"
      />
    </div>

    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium">To date</label>
      <input
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
        className="border px-3 py-2 rounded-md min-w-[160px]"
      />
    </div>
  </div>

  {/* RIGHT: Action Buttons */}
  <div className="flex gap-3">
    <button
      className="border rounded-md px-6 py-2 text-sm font-medium hover:bg-gray-100"
      onClick={() => refetch()}
    >
      Filter
    </button>

    <button className="border rounded-md px-6 py-2 text-sm font-medium hover:bg-gray-100">
      Export
    </button>

    <button
      className="bg-orange-500 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-orange-600"
      onClick={() => setOpenForm(true)}
    >
      + Add Attendance
    </button>
  </div>
</div>

        <AttendanceTable
          employees={employees}
          records={attendanceRecords}
          fromDate={fromDateFormatted}
          toDate={toDateFormatted}
        />
      </Box>
    </Box>
  );
}
