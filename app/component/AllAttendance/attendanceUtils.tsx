export function calculateWorkingHours(
  punchIn?: string,
  punchOut?: string
): number | null {
  if (!punchIn || !punchOut) return null;

  const inTime = new Date(punchIn);
  const outTime = new Date(punchOut);

  const diffMs = outTime.getTime() - inTime.getTime();
  return Number((diffMs / (1000 * 60 * 60)).toFixed(2));
}

export type AttendanceStatus =
  | 'PRESENT'
  | 'ABSENT'
  | 'LATE'
  | 'LEAVE'
  | 'HOLIDAY'
  | 'WEEK_OFF';

export type WorkingType = 'FULL_TIME' | 'HALF_DAY' | 'PART_TIME';

export function calculateStatus(
  punchIn?: string,
  isLeave?: boolean
): AttendanceStatus {
  if (isLeave) return 'LEAVE';
  if (!punchIn) return 'ABSENT';

  const punchInDate = new Date(punchIn);
  const hour = punchInDate.getUTCHours(); // Use UTC hours since we store local time as UTC
  const minutes = punchInDate.getUTCMinutes();
  const totalMinutes = hour * 60 + minutes;

  const officeStartMinutes = 10 * 60; // 10:00 AM
  const graceMinutes = 60; // 1 hour grace
  const lateThreshold = officeStartMinutes + graceMinutes; // 11:00 AM

  if (totalMinutes <= lateThreshold) return 'PRESENT';
  return 'LATE';
}

export function getWorkingType(
  hours: number | null,
  requiredHours = 8
): WorkingType | null {
  if (!hours || hours === 0) return null;
  if (hours >= requiredHours) return 'FULL_TIME';
  if (hours >= requiredHours / 2) return 'HALF_DAY';
  return 'PART_TIME';
}

export function formatHours(hours: number | null): string {
  if (!hours || hours === 0) return '-';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
}

/**
 * Format datetime to time string (HH:mm) - no timezone conversion
 */
export function formatTime(dateTime?: string | Date): string {
  if (!dateTime) return '-';
  
  const date = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
  
  // Use UTC methods to display the stored time as-is
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  
  return `${hours}:${minutes}`;
}

/**
 * Format datetime to date string (dd-mm-yyyy)
 */
export function formatDate(dateTime?: string | Date): string {
  if (!dateTime) return '-';
  const date = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear();
  
  return `${day}-${month}-${year}`;
}