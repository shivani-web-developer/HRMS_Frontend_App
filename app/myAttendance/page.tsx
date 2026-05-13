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
// import { formatISTTime } from '../component/AllAttendance/attendanceUtils';
import { formatTime, formatDate } from '../component/AllAttendance/attendanceUtils';

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

// export const formatDate = (date: Date) => {
//   const d = date.getDate().toString().padStart(2, '0');
//   const m = (date.getMonth() + 1).toString().padStart(2, '0');
//   const y = date.getFullYear();
//   return `${d}-${m}-${y}`;
// };

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
console.log("Fetching attendance for empId:", empId, "from:", fromDateFormatted, "to:", toDateFormatted);
  const { data = [], isLoading, refetch } = useGetMyAttendanceQuery(
    empId
      ? { employeeId: empId, fromDate: fromDateFormatted, toDate: toDateFormatted }
      : skipToken
  );
console.log("My Attendance Data:", data);
  // Transform backend data
  const transformedRecords = data.data?.map((rec: any) => {
  const punchInDate = rec.punchIn ? new Date(rec.punchIn) : null;
  const punchOutDate = rec.punchOut ? new Date(rec.punchOut) : null;
  
  return {
    date: rec.punchDate ? formatDate(rec.punchDate) : '-',
    punchIn: punchInDate ? formatTime(punchInDate) : undefined,
    punchOut: punchOutDate ? formatTime(punchOutDate) : undefined,
    punchInRaw: rec.punchIn,
    punchOutRaw: rec.punchOut,
    punchInLocation: rec.punchInLocation,
    punchOutLocation: rec.punchOutLocation,
    workingType: rec.workingType,
    status: rec.status,
    isLeave: false,
  };
}) ?? [];
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
       <div className="flex flex-wrap items-end justify-between gap-4 p-4 ">
  
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
