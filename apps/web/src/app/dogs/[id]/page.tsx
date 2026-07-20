'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch, resolveFileUrl } from '@/lib/api';
import type { Dog } from '@/types';
import { LABELS } from '@/types';
import { formatDate } from '@/lib/utils';
import { DogNav } from '@/components/dogs/DogNav';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Pencil } from 'lucide-react';

export default function DogProfilePage({ params }: { params: Promise<{ id: string }> }) {
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
      <DogNav dogId={id} dogName={dog.name} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
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
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={dog.status === 'active' ? 'success' : 'outline'}>
                  {LABELS.dogStatus[dog.status]}
                </Badge>
              </div>
              <Link href={`/dogs/${id}/edit`}>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <Pencil className="h-4 w-4 mr-1" />
                  Editar perfil
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información general</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
              <div>
                <p className="text-muted-foreground">Raza</p>
                <p className="font-medium">{dog.breed?.name ?? 'No especificada'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Sexo</p>
                <p className="font-medium">{LABELS.gender[dog.gender]}</p>
              </div>
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

          {dog.origin && (
            <Card>
              <CardHeader>
                <CardTitle>Origen</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>
                  <span className="text-muted-foreground">Tipo:</span>{' '}
                  {LABELS.sourceType[dog.origin.sourceType]}
                </p>
                <p>
                  <span className="text-muted-foreground">Fuente:</span> {dog.origin.sourceName}
                </p>
                {dog.origin.motherName && <p>Madre: {dog.origin.motherName}</p>}
                {dog.origin.fatherName && <p>Padre: {dog.origin.fatherName}</p>}
              </CardContent>
            </Card>
          )}

          {dog.baptism && (
            <Card>
              <CardHeader>
                <CardTitle>Bautizo</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>Nombre: {dog.baptism.assignedName}</p>
                <p>Fecha: {formatDate(dog.baptism.ceremonyDate)}</p>
                {dog.baptism.notes && <p>{dog.baptism.notes}</p>}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
