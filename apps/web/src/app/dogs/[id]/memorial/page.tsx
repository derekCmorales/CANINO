'use client';

import { use, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { Dog, Memorial, UpsertMemorialDto } from '@/types';
import { formatDate } from '@/lib/utils';
import { DogNav } from '@/components/dogs/DogNav';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Flower2 } from 'lucide-react';

const schema = z.object({
  deathDate: z.string().min(1, 'La fecha es obligatoria'),
  cause: z.string().optional(),
  notes: z.string().optional(),
  burialPlace: z.string().optional(),
  burialAddress: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  contactInfo: z.string().optional(),
});

export default function DogMemorialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);

  const { data: dog, isLoading: dogLoading } = useQuery({
    queryKey: ['dog', id],
    queryFn: () => apiFetch<Dog>(`/dogs/${id}`),
  });

  const { data: memorial, isLoading: memorialLoading } = useQuery({
    queryKey: ['memorial', id],
    queryFn: () => apiFetch<Memorial>(`/dogs/${id}/memorial`).catch(() => null),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<
    z.infer<typeof schema>
  >({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (memorial) {
      reset({
        deathDate: memorial.deathDate.slice(0, 10),
        cause: memorial.cause ?? '',
        notes: memorial.notes ?? '',
        burialPlace: memorial.burialPlace ?? '',
        burialAddress: memorial.burialAddress ?? '',
        latitude: memorial.latitude ?? undefined,
        longitude: memorial.longitude ?? undefined,
        contactInfo: memorial.contactInfo ?? '',
      });
    }
  }, [memorial, reset]);

  const mutation = useMutation({
    mutationFn: (data: UpsertMemorialDto) =>
      apiFetch<Memorial>(`/dogs/${id}/memorial`, { method: 'PUT', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memorial', id] });
      queryClient.invalidateQueries({ queryKey: ['dog', id] });
      setSuccess(true);
    },
  });

  if (dogLoading || memorialLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <DogNav dogId={id} dogName={dog?.name} />

      {memorial && (
        <Card className="mb-6 border-stone-200 bg-stone-50">
          <CardContent className="py-8 text-center">
            <Flower2 className="h-10 w-10 mx-auto text-stone-400 mb-3" />
            <p className="text-lg font-serif italic text-stone-700">
              En memoria de {dog?.name}
            </p>
            <p className="text-sm text-stone-500 mt-1">
              {formatDate(memorial.deathDate)}
            </p>
            {memorial.notes && (
              <p className="text-sm text-stone-600 mt-4 max-w-md mx-auto">{memorial.notes}</p>
            )}
          </CardContent>
        </Card>
      )}

      {success && (
        <Alert variant="success" className="mb-4">
          Memorial guardado. El estado del perro se ha actualizado.
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{memorial ? 'Actualizar memorial' : 'Crear memorial'}</CardTitle>
        </CardHeader>
        <CardContent>
          {!memorial && (
            <Alert variant="warning" className="mb-4">
              Al guardar el memorial, el estado del perro cambiará a &quot;Fallecido&quot;.
            </Alert>
          )}
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
            <Input
              label="Fecha de fallecimiento"
              type="date"
              error={errors.deathDate?.message}
              {...register('deathDate')}
            />
            <Input label="Causa" {...register('cause')} />
            <Textarea label="Notas conmemorativas" rows={4} {...register('notes')} />
            <Input label="Lugar de sepultura" {...register('burialPlace')} />
            <Input label="Dirección del lugar" {...register('burialAddress')} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Latitud" type="number" step="any" {...register('latitude')} />
              <Input label="Longitud" type="number" step="any" {...register('longitude')} />
            </div>
            <Input label="Información de contacto" {...register('contactInfo')} />
            <Button type="submit" loading={mutation.isPending}>
              {memorial ? 'Actualizar memorial' : 'Crear memorial'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
