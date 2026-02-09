export function AttendanceLegend() {
  const items = [
    { label: 'Present', color: 'bg-green-500', code: 'P' },
    { label: 'Absent', color: 'bg-red-500', code: 'A' },
    { label: 'Late', color: 'bg-yellow-500', code: 'L' },
    { label: 'Holiday', color: 'bg-blue-500', code: 'H' },
    { label: 'Week Off', color: 'bg-purple-500', code: 'WO' },
    { label: 'Leave', color: 'bg-yellow-500', code: 'LV' },
  ];

  return (
    <div className="flex my-1 flex-wrap gap-4 text-sm">
      {items.map(i => (
        <div key={i.code} className="flex items-center gap-2 ">
          <span className={`w-3 h-3 rounded ${i.color}`} />
          {i.code} - {i.label}
        </div>
      ))}
    </div>
  );
}
