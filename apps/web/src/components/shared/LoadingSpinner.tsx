import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
};

export function LoadingSpinner({ size = 'md', className, label = 'Cargando...' }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center gap-3', className)} role="status" aria-label={label}>
      <div
        className={cn(
          'animate-spin rounded-full border-primary border-t-transparent',
          sizes[size],
        )}
      />
      {size !== 'sm' && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
}
