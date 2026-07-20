'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { Dog, TimelineEvent } from '@/types';
import { DogNav } from '@/components/dogs/DogNav';
import { Timeline } from '@/components/shared/Timeline';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function DogTimelinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: dog } = useQuery({
    queryKey: ['dog', id],
    queryFn: () => apiFetch<Dog>(`/dogs/${id}`),
  });

  const { data: events, isLoading } = useQuery({
    queryKey: ['timeline', id],
    queryFn: () => apiFetch<TimelineEvent[]>(`/dogs/${id}/timeline`),
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
      <DogNav dogId={id} dogName={dog?.name} />
      <Card>
        <CardHeader>
          <CardTitle>Línea de tiempo</CardTitle>
        </CardHeader>
        <CardContent>
          <Timeline events={events ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}
