import type { LucideIcon } from 'lucide-react';

interface DashboardStatsProps {
 title: string;
 value: string | number;
 subtitle?: string;
 icon: LucideIcon;
 accent?: boolean;
}

export function DashboardStats({ title, value, subtitle, icon: Icon, accent }: DashboardStatsProps) {
 return (
  <div className={`p-4 rounded-lg ${
   accent 
    ? 'bg-primary/10 border border-primary/30' 
    : 'bg-card border border-border'
  }`}>
   <div className="flex items-center gap-3">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
     accent ? 'bg-primary/20' : 'bg-card'
    }`}>
     <Icon className={`w-5 h-5 ${accent ? 'text-primary' : 'text-muted-foreground'}`} />
    </div>
    <div>
     <div className="text-muted-foreground text-sm">{title}</div>
     <div className={`text-xl font-bold ${accent ? 'text-primary' : 'text-white'}`}>
      {value}
     </div>
     {subtitle && <div className="text-muted-foreground text-xs">{subtitle}</div>}
    </div>
   </div>
  </div>
 );
}