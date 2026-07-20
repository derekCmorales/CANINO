'use client';

import { use, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { Dog, UpsertPreferencesDto, Preferences } from '@/types';
import { DogNav } from '@/components/dogs/DogNav';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useState } from 'react';

const schema = z.object({
  likes: z.string().min(1, 'Indica qué le gusta a tu perro'),
  favoriteToys: z.string().optional(),
  favoriteActivities: z.string().optional(),
  favoriteTreats: z.string().optional(),
});

export default function DogPreferencesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);

  const { data: dog, isLoading } = useQuery({
    queryKey: ['dog', id],
    queryFn: () => apiFetch<Dog>(`/dogs/${id}`),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (dog?.preferences) {
      reset({
        likes: dog.preferences.likes,
        favoriteToys: dog.preferences.favoriteToys ?? '',
        favoriteActivities: dog.preferences.favoriteActivities ?? '',
        favoriteTreats: dog.preferences.favoriteTreats ?? '',
      });
    }
  }, [dog, reset]);

  const mutation = useMutation({
    mutationFn: (data: UpsertPreferencesDto) =>
      apiFetch<Preferences>(`/dogs/${id}/preferences`, { method: 'PUT', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dog', id] });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <DogNav dogId={id} dogName={dog?.name} />
      {success && (
        <Alert variant="success" className="mb-4">
          Preferencias guardadas correctamente.
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Gustos y preferencias</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
            <Textarea
              label="¿Qué le gusta?"
              error={errors.likes?.message}
              {...register('likes')}
            />
            <Input label="Juguetes favoritos" {...register('favoriteToys')} />
            <Input label="Actividades favoritas" {...register('favoriteActivities')} />
            <Input label="Premios favoritos" {...register('favoriteTreats')} />
            <Button type="submit" loading={mutation.isPending}>
              Guardar preferencias
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
