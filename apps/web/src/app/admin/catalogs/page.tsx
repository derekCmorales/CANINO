'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { Breed, VaccineType, CreateBreedDto, CreateVaccineTypeDto } from '@/types';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Plus, Trash2 } from 'lucide-react';

const breedSchema = z.object({
  name: z.string().min(1),
  sizeCategory: z.string().optional(),
});

const vaccineSchema = z.object({
  name: z.string().min(1),
  recommendedIntervalDays: z.coerce.number().optional(),
});

export default function AdminCatalogsPage() {
  const queryClient = useQueryClient();
  const [breedModal, setBreedModal] = useState(false);
  const [vaccineModal, setVaccineModal] = useState(false);

  const { data: breeds, isLoading: breedsLoading } = useQuery({
    queryKey: ['admin-breeds'],
    queryFn: () => apiFetch<Breed[]>('/admin/breeds'),
  });

  const { data: vaccines, isLoading: vaccinesLoading } = useQuery({
    queryKey: ['admin-vaccines'],
    queryFn: () => apiFetch<VaccineType[]>('/admin/vaccine-types'),
  });

  const breedForm = useForm<z.infer<typeof breedSchema>>({ resolver: zodResolver(breedSchema) });
  const vaccineForm = useForm<z.infer<typeof vaccineSchema>>({ resolver: zodResolver(vaccineSchema) });

  const createBreed = useMutation({
    mutationFn: (data: CreateBreedDto) =>
      apiFetch('/admin/breeds', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-breeds'] });
      setBreedModal(false);
      breedForm.reset();
    },
  });

  const deleteBreed = useMutation({
    mutationFn: (id: string) => apiFetch(`/admin/breeds/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-breeds'] }),
  });

  const createVaccine = useMutation({
    mutationFn: (data: CreateVaccineTypeDto) =>
      apiFetch('/admin/vaccine-types', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vaccines'] });
      setVaccineModal(false);
      vaccineForm.reset();
    },
  });

  const deleteVaccine = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/admin/vaccine-types/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-vaccines'] }),
  });

  if (breedsLoading || vaccinesLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Catálogos</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Razas ({breeds?.length ?? 0})</CardTitle>
            <Button size="sm" onClick={() => setBreedModal(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {breeds?.map((breed) => (
              <div
                key={breed.id}
                className="flex items-center justify-between rounded-lg border border-border p-3 text-sm"
              >
                <div>
                  <p className="font-medium">{breed.name}</p>
                  {breed.sizeCategory && (
                    <p className="text-muted-foreground text-xs">{breed.sizeCategory}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={breed.isActive ? 'success' : 'outline'}>
                    {breed.isActive ? 'Activa' : 'Inactiva'}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => deleteBreed.mutate(breed.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Tipos de vacuna ({vaccines?.length ?? 0})</CardTitle>
            <Button size="sm" onClick={() => setVaccineModal(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {vaccines?.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between rounded-lg border border-border p-3 text-sm"
              >
                <div>
                  <p className="font-medium">{v.name}</p>
                  <p className="text-muted-foreground text-xs">
                    Cada {v.recommendedIntervalDays} días
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={v.isActive ? 'success' : 'outline'}>
                    {v.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => deleteVaccine.mutate(v.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Modal open={breedModal} onClose={() => setBreedModal(false)} title="Nueva raza">
        <form
          onSubmit={breedForm.handleSubmit((data) => createBreed.mutate(data))}
          className="space-y-4"
        >
          <Input label="Nombre" {...breedForm.register('name')} />
          <Input label="Categoría de tamaño" placeholder="pequeño, mediano, grande" {...breedForm.register('sizeCategory')} />
          <Button type="submit" loading={createBreed.isPending}>Crear</Button>
        </form>
      </Modal>

      <Modal open={vaccineModal} onClose={() => setVaccineModal(false)} title="Nuevo tipo de vacuna">
        <form
          onSubmit={vaccineForm.handleSubmit((data) => createVaccine.mutate(data))}
          className="space-y-4"
        >
          <Input label="Nombre" {...vaccineForm.register('name')} />
          <Input
            label="Intervalo recomendado (días)"
            type="number"
            {...vaccineForm.register('recommendedIntervalDays')}
          />
          <Button type="submit" loading={createVaccine.isPending}>Crear</Button>
        </form>
      </Modal>
    </div>
  );
}
