'use client';

import { use, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { CreateMemoryDto, Dog, Memory } from '@/types';
import { DogNav } from '@/components/dogs/DogNav';
import { PhotoGallery } from '@/components/shared/PhotoGallery';
import { FileUpload } from '@/components/shared/FileUpload';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Plus, Trash2 } from 'lucide-react';

const schema = z.object({
  photoUrl: z.string().min(1, 'Sube una foto'),
  caption: z.string().optional(),
  memoryDate: z.string().optional(),
  people: z.string().optional(),
});

export default function DogMemoriesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: dog } = useQuery({
    queryKey: ['dog', id],
    queryFn: () => apiFetch<Dog>(`/dogs/${id}`),
  });

  const { data: memories, isLoading } = useQuery({
    queryKey: ['memories', id],
    queryFn: () => apiFetch<Memory[]>(`/dogs/${id}/memories`),
  });

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<
    z.infer<typeof schema>
  >({ resolver: zodResolver(schema) });

  const photoUrl = watch('photoUrl');

  const createMutation = useMutation({
    mutationFn: (data: CreateMemoryDto) =>
      apiFetch(`/dogs/${id}/memories`, { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories', id] });
      setModalOpen(false);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (memoryId: string) =>
      apiFetch(`/dogs/${id}/memories/${memoryId}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['memories', id] }),
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

      <div className="flex justify-end mb-4">
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Nuevo recuerdo
        </Button>
      </div>

      <PhotoGallery
        photos={(memories ?? []).map((m) => ({
          url: m.photoUrl,
          caption: m.caption,
          date: m.memoryDate,
        }))}
      />

      {memories && memories.length > 0 && (
        <div className="mt-6 space-y-2">
          {memories.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between rounded-xl border border-border p-3 text-sm"
            >
              <div>
                <p className="font-medium">{m.caption ?? 'Sin descripción'}</p>
                {m.people && <p className="text-muted-foreground">Con: {m.people}</p>}
              </div>
              <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(m.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo recuerdo">
        <form
          onSubmit={handleSubmit((data) => createMutation.mutate(data))}
          className="space-y-4"
        >
          <FileUpload value={photoUrl} onChange={(url) => setValue('photoUrl', url)} />
          {errors.photoUrl && <p className="text-xs text-destructive">{errors.photoUrl.message}</p>}
          <Textarea label="Descripción" {...register('caption')} />
          <Input label="Fecha" type="date" {...register('memoryDate')} />
          <Input label="Personas" placeholder="¿Quién estuvo presente?" {...register('people')} />
          <Button type="submit" loading={createMutation.isPending}>
            Guardar recuerdo
          </Button>
        </form>
      </Modal>
    </div>
  );
}
