'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import type { Dog } from '@/types';
import { DogCard } from '@/components/dogs/DogCard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export default function DogsListPage() {
  const { data: dogs, isLoading } = useQuery({
    queryKey: ['dogs'],
    queryFn: () => apiFetch<Dog[]>('/dogs'),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Mis perros</h1>
        <Link href="/dogs/new">
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            Nuevo perro
          </Button>
        </Link>
      </div>

      {!dogs?.length ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="text-muted-foreground mb-4">No tienes perros registrados.</p>
          <Link href="/dogs/new">
            <Button>Registrar perro</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dogs.map((dog) => (
            <DogCard key={dog.id} dog={dog} />
          ))}
        </div>
      )}
    </div>
  );
}
