'use client';

import { use, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { CreateHealthRecordDto, Dog, HealthRecord } from '@/types';
import { LABELS } from '@/types';
import { formatDateShort } from '@/lib/utils';
import { VaccineCalendar } from '@/components/health/VaccineCalendar';
import { HealthRecordForm } from '@/components/health/HealthRecordForm';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import Link from 'next/link';
import { Plus, ArrowLeft } from 'lucide-react';

export default function VetDogHealthPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<HealthRecord | null>(null);

  const { data: dog } = useQuery({
    queryKey: ['dog', id],
    queryFn: () => apiFetch<Dog>(`/dogs/${id}`),
  });

  const { data: records, isLoading } = useQuery({
    queryKey: ['health', id],
    queryFn: () => apiFetch<HealthRecord[]>(`/dogs/${id}/health`),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateHealthRecordDto) =>
      apiFetch<HealthRecord>(`/dogs/${id}/health`, { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health', id] });
      setModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ recordId, data }: { recordId: string; data: CreateHealthRecordDto }) =>
      apiFetch<HealthRecord>(`/health/${recordId}`, { method: 'PATCH', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health', id] });
      setModalOpen(false);
      setEditing(null);
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
    <div>
      <Link
        href={`/vet/dogs/${id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a {dog?.name ?? 'perfil'}
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Salud — {dog?.name}</h1>
        <Button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          Nuevo registro
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <VaccineCalendar records={records ?? []} />
        <Card>
          <CardHeader>
            <CardTitle>Historial médico</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {records?.map((record) => (
              <div
                key={record.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-border p-3"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-sm">{record.title}</p>
                    <Badge variant="outline">{LABELS.healthType[record.type]}</Badge>
                  </div>
                  {record.scheduledDate && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDateShort(record.scheduledDate)}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditing(record);
                    setModalOpen(true);
                  }}
                >
                  Editar
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        title={editing ? 'Editar registro' : 'Nuevo registro de salud'}
        size="lg"
      >
        <HealthRecordForm
          record={editing ?? undefined}
          loading={createMutation.isPending || updateMutation.isPending}
          onCancel={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSubmit={async (data) => {
            if (editing) {
              await updateMutation.mutateAsync({ recordId: editing.id, data });
            } else {
              await createMutation.mutateAsync(data);
            }
          }}
        />
      </Modal>
    </div>
  );
}
