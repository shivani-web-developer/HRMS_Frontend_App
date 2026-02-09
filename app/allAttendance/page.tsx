'use client';

import { Box } from '@mui/material';
import { useState } from 'react';
import Sidebar from '../component/layout/Sidebar';
import TopBar from '../component/layout/TopBar';
import { AttendanceTable } from '../component/AllAttendance/AttendanceTable';
import { formatDate, getCurrentMonthRange } from '../myAttendance/page';
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
         <div className="flex justify-between">
          <div className="flex gap-4">
            <span className="flex flex-col">
              <label className="mb-1">From date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border px-2 py-1 rounded"
              />
            </span>
            <span className="flex flex-col">
              <label className="mb-1">To date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border px-2 py-1 rounded"
              />
            </span>
          </div>

          <div className="flex gap-2">
            <button className="border rounded px-5 py-1 cursor-pointer" onClick={() => refetch()}>
              Filter
            </button>
            <button className="border rounded px-5 py-1 cursor-pointer">Export</button>
            <button
              className="bg-orange-500 text-white px-4 py-1 rounded cursor-pointer"
              onClick={() => setOpenForm(true)}
            >
              + Mark Attendance
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
