import { Trophy } from 'lucide-react';

interface PRBadgeProps {
  weight: number;
}

export function PRBadge({ weight }: PRBadgeProps) {
  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-[#B8956A]/20 border border-[#B8956A]/40 rounded">
      <Trophy className="w-3 h-3 text-[#B8956A]" />
      <span className="text-xs font-bold text-[#B8956A]">{weight}kg</span>
    </div>
  );
}