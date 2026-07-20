'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { Dog } from '@/types';
import { DogCard } from '@/components/dogs/DogCard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function AdminDogsPage() {
  const { data: dogs, isLoading } = useQuery({
    queryKey: ['admin-dogs'],
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
      <h1 className="text-2xl font-bold mb-6">Todos los perros</h1>
      {!dogs?.length ? (
        <p className="text-muted-foreground">No hay perros registrados en el sistema.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dogs.map((dog) => (
            <DogCard key={dog.id} dog={dog} href={`/admin/dogs/${dog.id}`} showOwner />
          ))}
        </div>
      )}
    </div>
  );
}
