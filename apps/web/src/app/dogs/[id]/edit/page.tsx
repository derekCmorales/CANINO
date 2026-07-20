'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { CreateDogDto, Dog } from '@/types';
import { DogForm } from '@/components/dogs/DogForm';
import { DogNav } from '@/components/dogs/DogNav';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EditDogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: dog, isLoading } = useQuery({
    queryKey: ['dog', id],
    queryFn: () => apiFetch<Dog>(`/dogs/${id}`),
  });

  const mutation = useMutation({
    mutationFn: (data: CreateDogDto) =>
      apiFetch<Dog>(`/dogs/${id}`, { method: 'PATCH', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dog', id] });
      router.push(`/dogs/${id}`);
    },
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
    <div className="max-w-xl mx-auto">
      <Link
        href={`/dogs/${id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al perfil
      </Link>
      <DogNav dogId={id} dogName={dog.name} />
      <Card>
        <CardHeader>
          <CardTitle>Editar perro</CardTitle>
        </CardHeader>
        <CardContent>
          <DogForm
            dog={dog}
            onSubmit={async (data) => {
              await mutation.mutateAsync(data);
            }}
            loading={mutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
