import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendUp, TrendDown } from '@phosphor-icons/react';

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: number;
  className?: string;
}

export function MetricCard({ label, value, trend, className }: MetricCardProps) {
  return (
    <Card className={cn('', className)}>
      <CardContent className="p-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold">{value}</p>
            {trend !== undefined && (
              <div
                className={cn(
                  'flex items-center gap-1 text-sm font-medium',
                  trend >= 0 ? 'text-[oklch(0.70_0.20_145)]' : 'text-[oklch(0.65_0.24_25)]'
                )}
              >
                {trend >= 0 ? <TrendUp weight="bold" /> : <TrendDown weight="bold" />}
                <span>{Math.abs(trend).toFixed(1)}%</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
