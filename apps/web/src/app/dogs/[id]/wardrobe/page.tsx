'use client';

import { use, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch, resolveFileUrl } from '@/lib/api';
import type { CreateWardrobeItemDto, Dog, WardrobeItem } from '@/types';
import { LABELS } from '@/types';
import { DogNav } from '@/components/dogs/DogNav';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { FileUpload } from '@/components/shared/FileUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Plus, Trash2, Star } from 'lucide-react';

const schema = z.object({
  itemType: z.enum(['clothing', 'collar', 'leash', 'tag', 'other'] as const),
  name: z.string().min(1),
  size: z.string().optional(),
  color: z.string().optional(),
  photoUrl: z.string().optional(),
  isFavorite: z.boolean().optional(),
});

export default function DogWardrobePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: dog } = useQuery({
    queryKey: ['dog', id],
    queryFn: () => apiFetch<Dog>(`/dogs/${id}`),
  });

  const { data: items, isLoading } = useQuery({
    queryKey: ['wardrobe', id],
    queryFn: () => apiFetch<WardrobeItem[]>(`/dogs/${id}/wardrobe`),
  });

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<
    z.infer<typeof schema>
  >({ resolver: zodResolver(schema), defaultValues: { itemType: 'clothing', isFavorite: false } });

  const photoUrl = watch('photoUrl');

  const createMutation = useMutation({
    mutationFn: (data: CreateWardrobeItemDto) =>
      apiFetch(`/dogs/${id}/wardrobe`, { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wardrobe', id] });
      setModalOpen(false);
      reset({ itemType: 'clothing', isFavorite: false });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (itemId: string) =>
      apiFetch(`/dogs/${id}/wardrobe/${itemId}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wardrobe', id] }),
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
          Agregar prenda
        </Button>
      </div>

      {!items?.length ? (
        <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">
          El guardarropa está vacío.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-square bg-muted">
                {item.photoUrl ? (
                  <img
                    src={resolveFileUrl(item.photoUrl)}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                    Sin foto
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <Badge variant="outline" className="mt-1">
                      {LABELS.wardrobeType[item.itemType]}
                    </Badge>
                    {item.isFavorite && (
                      <Star className="inline h-4 w-4 text-amber-500 ml-1 fill-amber-500" />
                    )}
                    {(item.size || item.color) && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {[item.size, item.color].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMutation.mutate(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nueva prenda">
        <form
          onSubmit={handleSubmit((data) => createMutation.mutate(data))}
          className="space-y-4"
        >
          <Select
            label="Tipo"
            options={Object.entries(LABELS.wardrobeType).map(([value, label]) => ({
              value,
              label,
            }))}
            {...register('itemType')}
          />
          <Input label="Nombre" error={errors.name?.message} {...register('name')} />
          <Input label="Talla" {...register('size')} />
          <Input label="Color" {...register('color')} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register('isFavorite')} className="rounded" />
            Marcar como favorito
          </label>
          <FileUpload value={photoUrl} onChange={(url) => setValue('photoUrl', url)} />
          <Button type="submit" loading={createMutation.isPending}>
            Agregar
          </Button>
        </form>
      </Modal>
    </div>
  );
}
