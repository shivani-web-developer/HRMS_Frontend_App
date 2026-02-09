'use client';
import { Box } from '@mui/material';
import { useState } from 'react';
import Sidebar from '../component/layout/Sidebar';
import TopBar from '../component/layout/TopBar';
import { MyAttendanceTable } from '../component/attendance/MyAttendance';
import PunchAttendanceModal from '../component/attendance/AttendanceForm';
import { useGetMyAttendanceQuery } from '../redux/attendance/attendanceApi';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { skipToken } from '@reduxjs/toolkit/query';

export interface MyAttendanceRecord {
  date: string;
  punchIn?: string;
  punchOut?: string;
  punchInLocation?: string;
  punchOutLocation?: string;
  workingType?: string;
  status?: string;
}

export const getCurrentMonthRange = () => {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(),2);
  const to = new Date(now.getFullYear(), now.getMonth() + 1,1);
  return { from: from.toISOString().split('T')[0], to: to.toISOString().split('T')[0] };
};

export const formatDate = (date: Date) => {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
};

export default function AttendancePage() {
  const { from, to } = getCurrentMonthRange();
  const [fromDate, setFromDate] = useState(from);
  const [toDate, setToDate] = useState(to);
  const [openForm, setOpenForm] = useState(false);

  // Persisted empId from localStorage
  const empId =
    useSelector((state: RootState) => state.user.empId) || localStorage.getItem('empId');

  const fromDateFormatted = formatDate(new Date(fromDate));
  const toDateFormatted = formatDate(new Date(toDate));

  const { data = [], isLoading, refetch } = useGetMyAttendanceQuery(
    empId
      ? { employeeId: empId, fromDate: fromDateFormatted, toDate: toDateFormatted }
      : skipToken
  );

  // Transform backend data
  const transformedRecords = data.data?.map((rec: any) => ({
    date: new Date(rec.punchDate).toLocaleDateString('en-GB'),
    punchIn: rec.punchIn
      ? new Date(rec.punchIn).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      : undefined,
    punchOut: rec.punchOut
      ? new Date(rec.punchOut).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      : undefined,
    punchInLocation: rec.punchInLocation,
    punchOutLocation: rec.punchOutLocation,
    workingType: rec.workingType,
    status: rec.status,
  })) ?? [];

  // Check today's attendance for disabling buttons
 const todayAttendance = data?.data?.find(
  (rec: any) =>
    new Date(rec.punchDate).toDateString() === new Date().toDateString()
  );

const hasPunchedIn = Boolean(todayAttendance?.punchIn);
const hasPunchedOut = Boolean(todayAttendance?.punchOut);

  return (
    <Box display="flex" height="100vh" overflow="hidden">
      <Sidebar />
      <Box flex={1} display="flex" flexDirection="column" overflow="scroll" p={3} bgcolor="#f9fafb">
        <TopBar title="My Attendance" subtitle="Comprehensive attendance tracking and analysis." />
     
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
              + Add Attendance
            </button>
          </div>
        </div>

        <MyAttendanceTable records={transformedRecords} />

        {openForm && empId && (
          <PunchAttendanceModal
            open={openForm}
            onClose={() => setOpenForm(false)}
            employeeId={empId}
            onRefresh={refetch}
            hasPunchedIn={hasPunchedIn}
            hasPunchedOut={hasPunchedOut}
            todayAttendance={todayAttendance}
          />
        )}
      </Box>
    </Box>
  );
}
