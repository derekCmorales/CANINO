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
import { Button } from '@/components/ui/Button';
import { Stethoscope, ArrowLeft } from 'lucide-react';

export default function VetDogDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
        href="/vet/dogs"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al listado
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-1">
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
          <CardContent className="p-4">
            <Badge variant={dog.status === 'active' ? 'success' : 'outline'}>
              {LABELS.dogStatus[dog.status]}
            </Badge>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{dog.name}</h1>
              <p className="text-muted-foreground">
                {dog.breed?.name ?? 'Sin raza'} · {LABELS.gender[dog.gender]}
              </p>
              {dog.owner?.profile && (
                <p className="text-sm text-muted-foreground mt-1">
                  Dueño: {dog.owner.profile.fullName} ({dog.owner.email})
                </p>
              )}
            </div>
            <Link href={`/vet/dogs/${id}/health`}>
              <Button>
                <Stethoscope className="h-4 w-4 mr-1" />
                Salud
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Información general</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
              <div>
                <p className="text-muted-foreground">Fecha de nacimiento</p>
                <p className="font-medium">{formatDate(dog.birthDate)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Lugar de nacimiento</p>
                <p className="font-medium">{dog.birthPlace ?? '—'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
