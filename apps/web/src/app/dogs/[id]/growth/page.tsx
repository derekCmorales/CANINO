'use client';

import { use, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type {
  CreateExerciseLogDto,
  CreateGrowthRecordDto,
  Dog,
  ExerciseLog,
  GrowthRecord,
  ExerciseIntensity,
} from '@/types';
import { LABELS } from '@/types';
import { formatDateShort } from '@/lib/utils';
import { DogNav } from '@/components/dogs/DogNav';
import { WeightChart } from '@/components/growth/WeightChart';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Plus } from 'lucide-react';

const weightSchema = z.object({
  weightKg: z.coerce.number().positive('El peso debe ser positivo'),
  recordedAt: z.string().min(1),
});

const exerciseSchema = z.object({
  activityType: z.string().min(1),
  durationMinutes: z.coerce.number().positive(),
  intensity: z.enum(['low', 'medium', 'high'] as const),
  loggedAt: z.string().min(1),
  notes: z.string().optional(),
});

export default function DogGrowthPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const [weightModal, setWeightModal] = useState(false);
  const [exerciseModal, setExerciseModal] = useState(false);

  const { data: dog } = useQuery({
    queryKey: ['dog', id],
    queryFn: () => apiFetch<Dog>(`/dogs/${id}`),
  });

  const { data: weights, isLoading: weightsLoading } = useQuery({
    queryKey: ['weights', id],
    queryFn: () => apiFetch<GrowthRecord[]>(`/dogs/${id}/growth/weight`),
  });

  const { data: exercises, isLoading: exercisesLoading } = useQuery({
    queryKey: ['exercises', id],
    queryFn: () => apiFetch<ExerciseLog[]>(`/dogs/${id}/growth/exercise`),
  });

  const weightForm = useForm<z.infer<typeof weightSchema>>({
    resolver: zodResolver(weightSchema),
    defaultValues: { recordedAt: new Date().toISOString().slice(0, 10) },
  });

  const exerciseForm = useForm<z.infer<typeof exerciseSchema>>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      intensity: 'medium',
      loggedAt: new Date().toISOString().slice(0, 10),
    },
  });

  const weightMutation = useMutation({
    mutationFn: (data: CreateGrowthRecordDto) =>
      apiFetch(`/dogs/${id}/growth/weight`, { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weights', id] });
      setWeightModal(false);
      weightForm.reset({ recordedAt: new Date().toISOString().slice(0, 10) });
    },
  });

  const exerciseMutation = useMutation({
    mutationFn: (data: CreateExerciseLogDto) =>
      apiFetch(`/dogs/${id}/growth/exercise`, { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises', id] });
      setExerciseModal(false);
      exerciseForm.reset({
        intensity: 'medium',
        loggedAt: new Date().toISOString().slice(0, 10),
      });
    },
  });

  if (weightsLoading || exercisesLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <DogNav dogId={id} dogName={dog?.name} />

      <div className="flex gap-2 mb-4">
        <Button size="sm" onClick={() => setWeightModal(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Registrar peso
        </Button>
        <Button size="sm" variant="outline" onClick={() => setExerciseModal(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Registrar ejercicio
        </Button>
      </div>

      <div className="mb-6">
        <WeightChart records={weights ?? []} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de ejercicio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!exercises?.length && (
            <p className="text-sm text-muted-foreground">Sin ejercicios registrados.</p>
          )}
          {exercises?.map((ex) => (
            <div key={ex.id} className="rounded-xl border border-border p-3 text-sm">
              <p className="font-medium">{ex.activityType}</p>
              <p className="text-muted-foreground">
                {formatDateShort(ex.loggedAt)} · {ex.durationMinutes} min ·{' '}
                {LABELS.exerciseIntensity[ex.intensity]}
              </p>
              {ex.notes && <p className="mt-1">{ex.notes}</p>}
            </div>
          ))}
        </CardContent>
      </Card>

      <Modal open={weightModal} onClose={() => setWeightModal(false)} title="Registrar peso">
        <form
          onSubmit={weightForm.handleSubmit((data) => weightMutation.mutate(data))}
          className="space-y-4"
        >
          <Input
            label="Peso (kg)"
            type="number"
            step="0.1"
            {...weightForm.register('weightKg')}
          />
          <Input label="Fecha" type="date" {...weightForm.register('recordedAt')} />
          <Button type="submit" loading={weightMutation.isPending}>
            Guardar
          </Button>
        </form>
      </Modal>

      <Modal open={exerciseModal} onClose={() => setExerciseModal(false)} title="Registrar ejercicio">
        <form
          onSubmit={exerciseForm.handleSubmit((data) =>
            exerciseMutation.mutate({
              ...data,
              intensity: data.intensity as ExerciseIntensity,
            }),
          )}
          className="space-y-4"
        >
          <Input label="Tipo de actividad" {...exerciseForm.register('activityType')} />
          <Input
            label="Duración (minutos)"
            type="number"
            {...exerciseForm.register('durationMinutes')}
          />
          <Select
            label="Intensidad"
            options={Object.entries(LABELS.exerciseIntensity).map(([value, label]) => ({
              value,
              label,
            }))}
            {...exerciseForm.register('intensity')}
          />
          <Input label="Fecha" type="date" {...exerciseForm.register('loggedAt')} />
          <Textarea label="Notas" {...exerciseForm.register('notes')} />
          <Button type="submit" loading={exerciseMutation.isPending}>
            Guardar
          </Button>
        </form>
      </Modal>
    </div>
  );
}
