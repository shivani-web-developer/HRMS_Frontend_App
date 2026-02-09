import { Avatar } from './Avatar';

export function AvatarGroup({ employees }: { employees: any[] }) {
  const visible = employees.slice(0, 5);
  const remaining = employees.length - visible.length;

  return (
    <div className="flex -space-x-2">
      {visible.map((emp) => (
        <Avatar key={emp.id} name={`${emp.firstName} ${emp.lastName}`} />
      ))}

      {remaining > 0 && (
        <div className="w-8 h-8 rounded-full bg-gray-300 text-sm flex items-center justify-center">
          +{remaining}
        </div>
      )}
    </div>
  );
}
