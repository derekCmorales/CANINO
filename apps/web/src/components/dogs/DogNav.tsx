'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart,
  Clock,
  Stethoscope,
  Utensils,
  TrendingUp,
  Star,
  Shirt,
  Camera,
  Flower2,
} from 'lucide-react';

// Seguro (/insurance) oculto hasta V2 — la ruta stub sigue existiendo.
const tabs = [
  { href: '', label: 'Perfil', icon: Heart, suffix: '' },
  { href: '/timeline', label: 'Línea de tiempo', icon: Clock },
  { href: '/health', label: 'Salud', icon: Stethoscope },
  { href: '/nutrition', label: 'Nutrición', icon: Utensils },
  { href: '/growth', label: 'Crecimiento', icon: TrendingUp },
  { href: '/preferences', label: 'Gustos', icon: Star },
  { href: '/wardrobe', label: 'Guardarropa', icon: Shirt },
  { href: '/memories', label: 'Recuerdos', icon: Camera },
  { href: '/memorial', label: 'Memorial', icon: Flower2 },
];

interface DogNavProps {
  dogId: string;
  dogName?: string;
}

export function DogNav({ dogId, dogName }: DogNavProps) {
  const pathname = usePathname();
  const base = `/dogs/${dogId}`;

  return (
    <div className="mb-6">
      {dogName && (
        <h1 className="text-2xl font-bold mb-4">{dogName}</h1>
      )}
      <nav className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {tabs.map((tab) => {
          const href = `${base}${tab.href}`;
          const active =
            tab.href === ''
              ? pathname === base
              : pathname.startsWith(href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={href}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors',
                active
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-secondary',
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
