'use client';

import { resolveFileUrl } from '@/lib/api';
import { cn } from '@/lib/utils';
import { formatDateShort } from '@/lib/utils';

interface PhotoGalleryProps {
  photos: { url: string; caption?: string | null; date?: string | null }[];
  columns?: 2 | 3 | 4;
  onPhotoClick?: (index: number) => void;
}

export function PhotoGallery({ photos, columns = 3, onPhotoClick }: PhotoGalleryProps) {
  if (photos.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">
        No hay fotos para mostrar.
      </div>
    );
  }

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-3', gridCols[columns])}>
      {photos.map((photo, index) => (
        <button
          key={`${photo.url}-${index}`}
          type="button"
          onClick={() => onPhotoClick?.(index)}
          className={cn(
            'group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted',
            onPhotoClick && 'cursor-pointer',
          )}
        >
          <img
            src={resolveFileUrl(photo.url)}
            alt={photo.caption ?? 'Foto'}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          {(photo.caption || photo.date) && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-left">
              {photo.caption && (
                <p className="text-xs text-white font-medium line-clamp-2">{photo.caption}</p>
              )}
              {photo.date && (
                <p className="text-[10px] text-white/80 mt-0.5">{formatDateShort(photo.date)}</p>
              )}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
