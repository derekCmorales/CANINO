'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { CreateDogDto, Dog } from '@/types';
import { DogForm } from '@/components/dogs/DogForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewDogPage() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: CreateDogDto) => apiFetch<Dog>('/dogs', { method: 'POST', body: data }),
    onSuccess: (dog) => router.push(`/dogs/${dog.id}`),
  });

  return (
    <div className="max-w-xl mx-auto">
      <Link
        href="/dogs"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a mis perros
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Registrar nuevo perro</CardTitle>
        </CardHeader>
        <CardContent>
          <DogForm
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
