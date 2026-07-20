'use client';

import { use, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type {
  CreateMealLogDto,
  CreateNutritionPlanDto,
  Dog,
  MealLog,
  NutritionPlan,
  LifeStage,
} from '@/types';
import { LABELS } from '@/types';
import { formatDateShort } from '@/lib/utils';
import { DogNav } from '@/components/dogs/DogNav';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Plus } from 'lucide-react';

const planSchema = z.object({
  lifeStage: z.enum(['puppy', 'adult', 'senior'] as const),
  dietDescription: z.string().min(1, 'Describe la dieta'),
  restrictions: z.string().optional(),
  favoriteFood: z.string().optional(),
  activeFrom: z.string().min(1),
  activeTo: z.string().optional(),
});

const mealSchema = z.object({
  mealType: z.string().min(1, 'Tipo de comida obligatorio'),
  brand: z.string().optional(),
  portion: z.string().optional(),
});

export default function DogNutritionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const [planModal, setPlanModal] = useState(false);
  const [mealModal, setMealModal] = useState(false);

  const { data: dog } = useQuery({
    queryKey: ['dog', id],
    queryFn: () => apiFetch<Dog>(`/dogs/${id}`),
  });

  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ['nutrition-plans', id],
    queryFn: () => apiFetch<NutritionPlan[]>(`/dogs/${id}/nutrition/plans`),
  });

  const { data: meals, isLoading: mealsLoading } = useQuery({
    queryKey: ['meals', id],
    queryFn: () => apiFetch<MealLog[]>(`/dogs/${id}/nutrition/meals`),
  });

  const planForm = useForm<z.infer<typeof planSchema>>({
    resolver: zodResolver(planSchema),
    defaultValues: { lifeStage: 'adult' as LifeStage, activeFrom: new Date().toISOString().slice(0, 10) },
  });

  const mealForm = useForm<z.infer<typeof mealSchema>>({ resolver: zodResolver(mealSchema) });

  const planMutation = useMutation({
    mutationFn: (data: CreateNutritionPlanDto) =>
      apiFetch(`/dogs/${id}/nutrition/plans`, { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition-plans', id] });
      setPlanModal(false);
      planForm.reset();
    },
  });

  const mealMutation = useMutation({
    mutationFn: (data: CreateMealLogDto) =>
      apiFetch(`/dogs/${id}/nutrition/meals`, { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals', id] });
      setMealModal(false);
      mealForm.reset();
    },
  });

  if (plansLoading || mealsLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <DogNav dogId={id} dogName={dog?.name} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Planes nutricionales</CardTitle>
            <Button size="sm" onClick={() => setPlanModal(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {!plans?.length && (
              <p className="text-sm text-muted-foreground">Sin planes registrados.</p>
            )}
            {plans?.map((plan) => (
              <div key={plan.id} className="rounded-xl border border-border p-4 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{LABELS.lifeStage[plan.lifeStage]}</span>
                  <span className="text-muted-foreground">
                    {formatDateShort(plan.activeFrom)}
                    {plan.activeTo && ` — ${formatDateShort(plan.activeTo)}`}
                  </span>
                </div>
                <p>{plan.dietDescription}</p>
                {plan.restrictions && (
                  <p className="text-muted-foreground mt-1">Restricciones: {plan.restrictions}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Registro de comidas</CardTitle>
            <Button size="sm" onClick={() => setMealModal(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {!meals?.length && (
              <p className="text-sm text-muted-foreground">Sin comidas registradas.</p>
            )}
            {meals?.map((meal) => (
              <div key={meal.id} className="rounded-xl border border-border p-3 text-sm">
                <p className="font-medium">{meal.mealType}</p>
                <p className="text-muted-foreground">{formatDateShort(meal.loggedAt)}</p>
                {meal.brand && <p>Marca: {meal.brand}</p>}
                {meal.portion && <p>Porción: {meal.portion}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Modal open={planModal} onClose={() => setPlanModal(false)} title="Nuevo plan nutricional">
        <form
          onSubmit={planForm.handleSubmit((data) =>
            planMutation.mutate({
              ...data,
              lifeStage: data.lifeStage as LifeStage,
            }),
          )}
          className="space-y-4"
        >
          <Select
            label="Etapa de vida"
            options={Object.entries(LABELS.lifeStage).map(([value, label]) => ({ value, label }))}
            {...planForm.register('lifeStage')}
          />
          <Textarea label="Descripción de la dieta" {...planForm.register('dietDescription')} />
          <Input label="Restricciones" {...planForm.register('restrictions')} />
          <Input label="Comida favorita" {...planForm.register('favoriteFood')} />
          <Input label="Activo desde" type="date" {...planForm.register('activeFrom')} />
          <Input label="Activo hasta" type="date" {...planForm.register('activeTo')} />
          <Button type="submit" loading={planMutation.isPending}>
            Guardar plan
          </Button>
        </form>
      </Modal>

      <Modal open={mealModal} onClose={() => setMealModal(false)} title="Registrar comida">
        <form
          onSubmit={mealForm.handleSubmit((data) => mealMutation.mutate(data))}
          className="space-y-4"
        >
          <Input label="Tipo de comida" {...mealForm.register('mealType')} />
          <Input label="Marca" {...mealForm.register('brand')} />
          <Input label="Porción" {...mealForm.register('portion')} />
          <Button type="submit" loading={mealMutation.isPending}>
            Registrar
          </Button>
        </form>
      </Modal>
    </div>
  );
}
