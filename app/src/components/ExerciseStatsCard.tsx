import type { ExerciseStats } from '@/lib/exerciseStats';
import { PRBadge } from './PRBadge';

interface ExerciseStatsCardProps {
  stats: ExerciseStats;
}

export function ExerciseStatsCard({ stats }: ExerciseStatsCardProps) {
  const formatVolume = (volume: number): string => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toString();
  };

  const formatDate = (date: string | null): string => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="p-4 bg-card border border-border rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold tracking-wider text-white">{stats.exerciseName}</h3>
        {stats.personalRecord > 0 && <PRBadge weight={stats.personalRecord} />}
      </div>
      
      <div className="grid grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-lg font-bold text-white">
            {stats.personalRecord > 0 ? `${stats.personalRecord}kg` : '-'}
          </div>
          <div className="text-xs text-muted">PR</div>
        </div>
        <div>
          <div className="text-lg font-bold text-white">
            {stats.totalVolume > 0 ? formatVolume(stats.totalVolume) : '-'}
          </div>
          <div className="text-xs text-muted">Volume</div>
        </div>
        <div>
          <div className="text-lg font-bold text-white">
            {stats.bestSet.weight > 0 ? `${stats.bestSet.weight}x${stats.bestSet.reps}` : '-'}
          </div>
          <div className="text-xs text-muted">Melhor</div>
        </div>
        <div>
          <div className="text-lg font-bold text-white">{stats.totalWorkouts}</div>
          <div className="text-xs text-muted">Treinos</div>
        </div>
      </div>
      
      {stats.lastPerformed && (
        <div className="mt-3 pt-3 border-t border-border">
          <span className="text-xs text-muted">
            Último treino: {formatDate(stats.lastPerformed)}
          </span>
        </div>
      )}
    </div>
  );
}