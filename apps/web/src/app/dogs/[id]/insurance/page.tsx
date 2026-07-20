'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { Dog } from '@/types';
import { DogNav } from '@/components/dogs/DogNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Shield, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function DogInsurancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: dog } = useQuery({
    queryKey: ['dog', id],
    queryFn: () => apiFetch<Dog>(`/dogs/${id}`),
  });

  return (
    <div>
      <DogNav dogId={id} dogName={dog?.name} />

      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Seguro de vida</CardTitle>
              <CardDescription>Funcionalidad planificada para la versión 2</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Badge variant="warning">Próximamente — V2</Badge>
          <p className="text-muted-foreground text-sm leading-relaxed">
            En la próxima versión podrás registrar pólizas de seguro de vida para tu perro,
            gestionar reclamaciones y recibir alertas de vencimiento de cobertura.
          </p>
          <div className="rounded-xl bg-muted/50 p-4 flex items-start gap-3">
            <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">¿Qué incluirá?</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Registro de pólizas activas y vencidas</li>
                <li>Historial de reclamaciones</li>
                <li>Documentos adjuntos de la aseguradora</li>
                <li>Notificaciones de renovación</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
