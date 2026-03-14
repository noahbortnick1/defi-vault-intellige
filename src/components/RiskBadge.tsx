import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getRiskLevel } from '@/lib/risk';

interface RiskBadgeProps {
  score: number;
  className?: string;
}

export function RiskBadge({ score, className }: RiskBadgeProps) {
  const level = getRiskLevel(score);

  const colors = {
    low: 'bg-[oklch(0.70_0.20_145)]/10 text-[oklch(0.70_0.20_145)] border-[oklch(0.70_0.20_145)]/20',
    medium: 'bg-[oklch(0.75_0.18_85)]/10 text-[oklch(0.75_0.18_85)] border-[oklch(0.75_0.18_85)]/20',
    high: 'bg-[oklch(0.65_0.24_25)]/10 text-[oklch(0.65_0.24_25)] border-[oklch(0.65_0.24_25)]/20',
  };

  return (
    <Badge variant="outline" className={cn('font-mono font-medium border', colors[level], className)}>
      {score.toFixed(1)}
    </Badge>
  );
}
