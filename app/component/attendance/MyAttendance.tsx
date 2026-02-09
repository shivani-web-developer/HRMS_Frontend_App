import { useMemo, useState } from 'react';
import {
  calculateStatus,
  calculateWorkingHours,
  getWorkingType,
  formatHours,
} from '../AllAttendance/attendanceUtils';
import { AttendanceLegend } from './AttendanceLegend';

const PAGE_SIZE=10;
export function MyAttendanceTable({ records }: any) {
  console.log("record=",records)
    const [page, setPage] = useState(1);

  const safeRecords = records ?? [];
  const totalPages = Math.ceil(safeRecords.length / PAGE_SIZE);
   
   const paginatedRecords = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return records.slice(start, start + PAGE_SIZE);
  }, [page, records]);
  return (
    <>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
  <span className="text-sm text-gray-600">
    Showing {(page - 1) * PAGE_SIZE + 1}–
    {Math.min(page * PAGE_SIZE, records.length)} of {records.length} employees
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

      {/* Attendance legend */}
        <AttendanceLegend/>
      {/* Table */}
      <div className="relative overflow-x-auto overflow-y-auto max-h-[500px] border rounded mt-2" style={{scrollbarWidth:'none'}}>
        <table className="min-w-[1400px] w-full text-sm border-collapse">
          <thead className="bg-orange-500 sticky top-0 z-10">
            <tr>
              {[
                'Date',
                'Punch In',
                'Punch In Location',
                'Punch Out',
                'Punch Out Location',
                'Total Hours',
                'Working Type',
                'Status',
              ].map((h) => (
                <th
                  key={h}
                  className="border px-3 py-2 text-center whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

       <tbody>
            {paginatedRecords.length === 0 ? (
              <tr>
                <td className="border px-2 py-4 text-center" colSpan={8}>
                  No records found
                </td>
              </tr>
            ) : (
              paginatedRecords.map((rec: any, idx: number) => {
                const hours = calculateWorkingHours(rec.punchIn, rec.punchOut);
                const status = calculateStatus(rec.punchIn, rec.isLeave);
                const workingType = getWorkingType(hours);

                return (
                  <tr key={idx} className={`text-center ${idx % 2 === 0 ? 'bg-white' : 'bg-orange-200'}`}>
                    <td className='relative border px-2 py-2 left-0 font-medium z-20'>{rec.date}</td>
                    <td className="border px-2 py-1">{rec.punchIn ?? '-'}</td>
                    <td className="border px-2 py-1 max-w-[150px] truncate" title={rec.punchInLocation}>
                      {rec.punchInLocation ?? '-'}
                    </td>
                    <td className="border px-2 py-1">{rec.punchOut ?? '-'}</td>
                    <td className="border px-2 py-1 max-w-[150px] truncate" title={rec.punchOutLocation}>
                      {rec.punchOutLocation ?? '-'}
                    </td>
                    <td className="border px-2 py-1">{formatHours(hours)}</td>
                    <td className="border px-2 py-1">{workingType ?? '-'}</td>
                    <td className="border px-2 py-1">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          status === 'PRESENT'
                            ? 'bg-green-400 text-green-950'
                            : status === 'LATE'
                            ? 'bg-yellow-500 text-yellow-950'
                            : status === 'LEAVE'
                            ? 'bg-yellow-400 text-yellow-950'
                            : 'bg-red-400 text-red-950'
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
