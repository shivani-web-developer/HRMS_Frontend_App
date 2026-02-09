export function getMonthDays(year: number, month: number) {
  const date = new Date(year, month, 1);
  const days = [];

  while (date.getMonth() === month) {
    days.push(date.toISOString().split('T')[0]);
    date.setDate(date.getDate() + 1);
  }

  return days;
}

export function calculateWorkingHours(
  punchIn?: string,
  punchOut?: string
): number | null {
  if (!punchIn || !punchOut) return null;

  const inTime = new Date(`1970-01-01T${punchIn}`);
  const outTime = new Date(`1970-01-01T${punchOut}`);

  return (outTime.getTime() - inTime.getTime()) / 36e5;
}

export type AttendanceStatus =
  | 'PRESENT'
  | 'ABSENT'
  | 'LATE'
  | 'LEAVE'
  | 'HOLIDAY'
  | 'WEEK_OFF';

export type WorkingType = 'FULL_TIME' | 'HALF_DAY';

export function calculateStatus(
  punchIn?: string,
  officeTime = '09:00'
): AttendanceStatus {
  if (!punchIn) return 'ABSENT';

  const punch = new Date(`1970-01-01T${punchIn}`);
  const office = new Date(`1970-01-01T${officeTime}`);
  office.setHours(office.getHours() + 1); // 1 hour grace

  if (punch <= office) return 'PRESENT';
  return 'LATE';
}

export function getWorkingType(
  hours: number | null,
  requiredHours = 8
): WorkingType | null {
  if (!hours) return null;
  return hours >= requiredHours ? 'FULL_TIME' : 'HALF_DAY';
}

export function formatHours(hours: number | null): string {
  if (!hours) return '-';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
}
