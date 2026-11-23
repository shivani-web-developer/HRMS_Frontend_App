export function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="relative group">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold cursor-pointer">
        {initials}
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
        px-3 py-1.5 bg-white text-black text-xs rounded-md
        whitespace-nowrap opacity-0 invisible
        group-hover:opacity-100 group-hover:visible
        transition-all duration-200 z-50 pointer-events-none shadow-lg">
        {name}

        {/* Arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2
          border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
}
