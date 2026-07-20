'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import type { Dog, User } from '@/types';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Dog as DogIcon, Stethoscope } from 'lucide-react';

export default function VetDashboardPage() {
  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => apiFetch<User>('/auth/me'),
  });

  const { data: dogs, isLoading } = useQuery({
    queryKey: ['vet-dogs'],
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
      <h1 className="text-2xl font-bold mb-2">Panel veterinario</h1>
      <p className="text-muted-foreground mb-6">
        Bienvenido, {user?.profile?.fullName ?? 'Doctor'}. Tienes acceso de lectura a todos los perros.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <DogIcon className="h-8 w-8 text-primary" />
            <CardTitle>{dogs?.length ?? 0} perros</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/vet/dogs" className="text-sm text-primary hover:underline">
              Ver listado completo →
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Stethoscope className="h-8 w-8 text-primary" />
            <CardTitle>Registros de salud</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Selecciona un perro para registrar o consultar su historial médico.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
