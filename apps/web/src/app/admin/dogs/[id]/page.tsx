'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch, resolveFileUrl } from '@/lib/api';
import type { Dog } from '@/types';
import { LABELS } from '@/types';
import { formatDate } from '@/lib/utils';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AdminDogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: dog, isLoading } = useQuery({
    queryKey: ['dog', id],
    queryFn: () => apiFetch<Dog>(`/dogs/${id}`),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!dog) return null;

  return (
    <div>
      <Link
        href="/admin/dogs"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al listado
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden">
          <div className="aspect-square bg-muted">
            {dog.photoUrl ? (
              <img
                src={resolveFileUrl(dog.photoUrl)}
                alt={dog.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Sin foto
              </div>
            )}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>{dog.name}</CardTitle>
              <Badge variant={dog.status === 'active' ? 'success' : 'outline'}>
                {LABELS.dogStatus[dog.status]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
            <div>
              <p className="text-muted-foreground">Raza</p>
              <p className="font-medium">{dog.breed?.name ?? '—'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Sexo</p>
              <p className="font-medium">{LABELS.gender[dog.gender]}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Nacimiento</p>
              <p className="font-medium">{formatDate(dog.birthDate)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Dueño</p>
              <p className="font-medium">{dog.owner?.profile?.fullName ?? dog.owner?.email ?? '—'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
