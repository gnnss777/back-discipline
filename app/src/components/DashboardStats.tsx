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
        ? 'bg-[#B8956A]/10 border border-[#B8956A]/30' 
        : 'bg-[#111] border border-[#333]'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          accent ? 'bg-[#B8956A]/20' : 'bg-[#222]'
        }`}>
          <Icon className={`w-5 h-5 ${accent ? 'text-[#B8956A]' : 'text-gray-400'}`} />
        </div>
        <div>
          <div className="text-gray-400 text-sm">{title}</div>
          <div className={`text-xl font-bold ${accent ? 'text-[#B8956A]' : 'text-white'}`}>
            {value}
          </div>
          {subtitle && <div className="text-gray-500 text-xs">{subtitle}</div>}
        </div>
      </div>
    </div>
  );
}