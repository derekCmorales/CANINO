'use client';

import type { TimelineEvent } from '@/types';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import {
  Baby,
  MapPin,
  Droplets,
  Stethoscope,
  Scale,
  Dumbbell,
  UtensilsCrossed,
  ClipboardList,
  Camera,
  Flower2,
} from 'lucide-react';

const typeConfig: Record<
  TimelineEvent['type'],
  { icon: typeof Baby; color: string }
> = {
  birth: { icon: Baby, color: 'bg-pink-100 text-pink-700' },
  origin: { icon: MapPin, color: 'bg-blue-100 text-blue-700' },
  baptism: { icon: Droplets, color: 'bg-cyan-100 text-cyan-700' },
  health: { icon: Stethoscope, color: 'bg-red-100 text-red-700' },
  weight: { icon: Scale, color: 'bg-purple-100 text-purple-700' },
  exercise: { icon: Dumbbell, color: 'bg-green-100 text-green-700' },
  meal: { icon: UtensilsCrossed, color: 'bg-amber-100 text-amber-700' },
  nutrition_plan: { icon: ClipboardList, color: 'bg-orange-100 text-orange-700' },
  memory: { icon: Camera, color: 'bg-indigo-100 text-indigo-700' },
  memorial: { icon: Flower2, color: 'bg-stone-200 text-stone-700' },
};

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  const sorted = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  if (sorted.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">
        Aún no hay eventos en la línea de tiempo.
      </div>
    );
  }

  return (
    <div className="relative space-y-0">
      <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-border" aria-hidden />
      {sorted.map((event, index) => {
        const config = typeConfig[event.type] ?? typeConfig.health;
        const Icon = config.icon;
        return (
          <div key={`${event.type}-${event.date}-${index}`} className="relative flex gap-4 pb-8 last:pb-0">
            <div
              className={cn(
                'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                config.color,
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 pt-1">
              <p className="text-xs text-muted-foreground">{formatDate(event.date)}</p>
              <h4 className="font-semibold mt-0.5">{event.title}</h4>
              {event.description && (
                <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
