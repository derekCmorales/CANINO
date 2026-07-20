'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import type { Dog, VaccineAlerts } from '@/types';
import { DogCard } from '@/components/dogs/DogCard';
import { AlertBanner } from '@/components/shared/AlertBanner';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Bell } from 'lucide-react';

export default function DashboardPage() {
  const { data: dogs, isLoading: dogsLoading } = useQuery({
    queryKey: ['dogs'],
    queryFn: () => apiFetch<Dog[]>('/dogs'),
  });

  const { data: allAlerts } = useQuery({
    queryKey: ['dashboard-alerts'],
    queryFn: async () => {
      if (!dogs?.length) return { dueSoon: [], overdue: [] };
      const results = await Promise.all(
        dogs.map((dog) =>
          apiFetch<VaccineAlerts>(`/dogs/${dog.id}/health/alerts`).catch(() => ({
            dueSoon: [],
            overdue: [],
          })),
        ),
      );
      return {
        dueSoon: results.flatMap((r) => r.dueSoon),
        overdue: results.flatMap((r) => r.overdue),
      };
    },
    enabled: !!dogs?.length,
  });

  if (dogsLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Panel del dueño</h1>
          <p className="text-muted-foreground mt-1">
            Bienvenido. Aquí tienes un resumen de tus perros.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/notifications">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-1" />
              Notificaciones
            </Button>
          </Link>
          <Link href="/dogs/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Nuevo perro
            </Button>
          </Link>
        </div>
      </div>

      {allAlerts && (
        <AlertBanner dueSoon={allAlerts.dueSoon} overdue={allAlerts.overdue} />
      )}

      {!dogs?.length ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground mb-4">Aún no has registrado ningún perro.</p>
            <Link href="/dogs/new">
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                Registrar mi primer perro
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {dogs.map((dog) => (
              <DogCard key={dog.id} dog={dog} />
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resumen rápido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-secondary/50 p-4 text-center">
                  <p className="text-3xl font-bold text-primary">{dogs.length}</p>
                  <p className="text-sm text-muted-foreground">Perros registrados</p>
                </div>
                <div className="rounded-xl bg-secondary/50 p-4 text-center">
                  <p className="text-3xl font-bold text-warning">
                    {allAlerts?.dueSoon.length ?? 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Vacunas próximas</p>
                </div>
                <div className="rounded-xl bg-secondary/50 p-4 text-center">
                  <p className="text-3xl font-bold text-destructive">
                    {allAlerts?.overdue.length ?? 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Vacunas vencidas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
