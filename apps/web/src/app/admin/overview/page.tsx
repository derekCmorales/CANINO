'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { AdminStats } from '@/types';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Users, Dog, Stethoscope, Bell } from 'lucide-react';

export default function AdminOverviewPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => apiFetch<AdminStats>('/admin/stats'),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      title: 'Usuarios totales',
      value: stats.users.total,
      detail: `${stats.users.owners} dueños · ${stats.users.veterinarians} vets · ${stats.users.admins} admins`,
      icon: Users,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'Perros registrados',
      value: stats.dogs.total,
      detail: `${stats.dogs.active} activos · ${stats.dogs.deceased} fallecidos`,
      icon: Dog,
      color: 'text-primary bg-orange-100',
    },
    {
      title: 'Registros de salud',
      value: stats.healthRecords,
      detail: 'Total en el sistema',
      icon: Stethoscope,
      color: 'text-green-600 bg-green-100',
    },
    {
      title: 'Notificaciones',
      value: stats.notifications,
      detail: 'Enviadas en el sistema',
      icon: Bell,
      color: 'text-purple-600 bg-purple-100',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Resumen del sistema</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`rounded-lg p-2 ${card.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{card.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{card.detail}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
