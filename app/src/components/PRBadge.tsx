import { Trophy } from 'lucide-react';

interface PRBadgeProps {
 weight: number;
}

export function PRBadge({ weight }: PRBadgeProps) {
 return (
  <div className="flex items-center gap-1 px-2 py-1 bg-primary/20 border border-primary/40 rounded">
   <Trophy className="w-3 h-3 text-primary" />
   <span className="text-xs font-bold text-primary">{weight}kg</span>
  </div>
 );
}