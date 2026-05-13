'use client';
import { useEffect, useState } from 'react';
import { usePunchInMutation, usePunchOutMutation } from '../../redux/attendance/attendanceApi';
import { formatTime } from '../AllAttendance/attendanceUtils';

interface PunchAttendanceModalProps {
  open: boolean;
  employeeId: string;
  onClose: () => void;
  onRefresh: () => void;
  hasPunchedIn?: boolean;
  hasPunchedOut?: boolean;
  todayAttendance?: any; 
}

export default function PunchAttendanceModal({
  open,
  employeeId,
  onClose,
  onRefresh,
  hasPunchedIn = false,
  hasPunchedOut = false,
  todayAttendance,
}: PunchAttendanceModalProps) {
  const [punchIn, setPunchIn] = useState<Date | null>(null);
  const [punchOut, setPunchOut] = useState<Date | null>(null);
  const [punchInLocation, setPunchInLocation] = useState<any>(null);
  const [punchOutLocation, setPunchOutLocation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [attendanceId, setAttendanceId] = useState<string | null>(null);

  const [punchInData] = usePunchInMutation();
  const [punchOutData] = usePunchOutMutation();

  useEffect(() => {
  if (todayAttendance) {
    setPunchIn(todayAttendance.punchIn ? new Date(todayAttendance.punchIn) : null);
    setPunchOut(todayAttendance.punchOut ? new Date(todayAttendance.punchOut) : null);
    setAttendanceId(todayAttendance.id);
    setPunchInLocation(todayAttendance.punchInLocation ?? null);
      setPunchOutLocation(todayAttendance.punchOutLocation ?? null);
  }
}, [todayAttendance]);


  if (!open) return null;

  const getLocationWithAddress = (): Promise<{ lat: number; lng: number; address: string }> =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await res.json();
            resolve({ lat, lng, address: data.display_name });
          } catch {
            resolve({ lat, lng, address: 'Location not available' });
          }
        },
        reject,
        { enableHighAccuracy: true }
      );
    });

    const formatTimeIST = (date: Date) =>
    date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' });

  const handlePunchIn = async () => {
    try {
      setLoading(true);
      const now = new Date();
      const location = await getLocationWithAddress();
      const formattedDate = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
     console.log("Punching in with time:",now.toTimeString().slice(0, 5));
      const res = await punchInData({
        employeeId,
        date: formattedDate,
        time: now.toTimeString().slice(0, 5),
        location: location.address,
      }).unwrap();

      setAttendanceId(res.id);
      setPunchIn(now);
      setPunchInLocation(location.address);
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const handlePunchOut = async () => {
    if (!attendanceId) return;
    try {
      setLoading(true);
      const now = new Date();
      const location = await getLocationWithAddress();
      await punchOutData({
        attendanceId,
        date: `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1 ).padStart(2, '0')}-${now.getFullYear()}`,
        time: now.toTimeString().slice(0, 5),
        location: location.address,
      }).unwrap();

      setPunchOut(now);
      setPunchOutLocation(location.address);
      onRefresh();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-orange-500 w-full max-w-md rounded shadow-lg p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add Attendance</h2>
          <button onClick={onClose} className="text-md">
            X
          </button>
        </div>

        <div className="border gap-3 bg-gray-700 rounded p-5 flex justify-between">
          <button
            disabled={hasPunchedIn || loading}
            onClick={handlePunchIn}
            className={`w-full px-10 py-4 rounded cursor-pointer disabled:cursor-not-allowed ${
              hasPunchedIn ? 'bg-gray-300' : 'bg-green-700 text-white'
            }`}
          >
            Punch In
          </button>
          <button
            disabled={!hasPunchedIn || hasPunchedOut || loading}
            onClick={handlePunchOut}
            className={`w-full px-10 py-4 rounded cursor-pointer disabled:cursor-not-allowed ${
              !hasPunchedIn || hasPunchedOut ? 'bg-gray-300' : 'bg-red-600 text-white'
            }`}
          >
            Punch Out
          </button>
        </div>

        {/* punch in and punch out info */}
        <div className="bg-orange-300 rounded px-4 py-4 mt-2">
          {punchIn && (
            <div className="text-sm">
              <div>Punch In:</div>
              <div className="mt-1">📅 {punchIn.toDateString()}</div>
              <div>⏰ {formatTime(punchIn)}</div>
              <div>📍 {punchInLocation}</div>
            </div>
          )}

          {punchOut && (
            <div className="text-sm mt-2">
              <div>Punch Out:</div>
              <div className="mt-1">📅 {punchOut.toDateString()}</div>
              <div>⏰ {formatTime(punchOut)}</div>
              <div>📍 {punchOutLocation}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
