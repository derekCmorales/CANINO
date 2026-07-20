'use client';

import { cn } from '@/lib/utils';
import { resolveFileUrl } from '@/lib/api';
import type { Dog } from '@/types';
import { LABELS } from '@/types';
import { formatDateShort } from '@/lib/utils';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Heart, ChevronRight } from 'lucide-react';

interface DogCardProps {
  dog: Dog;
  href?: string;
  showOwner?: boolean;
}

export function DogCard({ dog, href, showOwner }: DogCardProps) {
  const link = href ?? `/dogs/${dog.id}`;

  return (
    <Link href={link}>
      <Card className="group overflow-hidden transition-all hover:shadow-md hover:border-primary/30">
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          {dog.photoUrl ? (
            <img
              src={resolveFileUrl(dog.photoUrl)}
              alt={dog.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Heart className="h-16 w-16 text-orange-200" />
            </div>
          )}
          <Badge
            variant={dog.status === 'deceased' ? 'outline' : 'success'}
            className="absolute top-3 right-3"
          >
            {LABELS.dogStatus[dog.status]}
          </Badge>
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-lg">{dog.name}</h3>
              <p className="text-sm text-muted-foreground">
                {dog.breed?.name ?? 'Sin raza'} · {LABELS.gender[dog.gender]}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Nacimiento: {formatDateShort(dog.birthDate)}
              </p>
              {showOwner && dog.owner?.profile && (
                <p className="text-xs text-muted-foreground mt-1">
                  Dueño: {dog.owner.profile.fullName}
                </p>
              )}
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
