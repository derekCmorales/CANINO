'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { UpdateProfileDto, User } from '@/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { FileUpload } from '@/components/shared/FileUpload';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useEffect, useState } from 'react';

const schema = z.object({
  fullName: z.string().min(2, 'El nombre es obligatorio'),
  phone: z.string().optional(),
  address: z.string().optional(),
  avatarUrl: z.string().optional(),
  documentUrl: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => apiFetch<User>('/users/me'),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const avatarUrl = watch('avatarUrl');
  const documentUrl = watch('documentUrl');

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.profile?.fullName ?? '',
        phone: user.profile?.phone ?? '',
        address: user.profile?.address ?? '',
        avatarUrl: user.profile?.avatarUrl ?? '',
        documentUrl: user.profile?.documentUrl ?? '',
      });
    }
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: (data: UpdateProfileDto) =>
      apiFetch<User>('/users/me', { method: 'PATCH', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    },
  });

  const whatsappMutation = useMutation({
    mutationFn: (whatsappOptIn: boolean) =>
      apiFetch<User>('/users/me/whatsapp', { method: 'PATCH', body: { whatsappOptIn } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['me'] }),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mi perfil</h1>

      {success && (
        <Alert variant="success" className="mb-4">
          Perfil actualizado correctamente.
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Información de cuenta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Correo:</span> {user?.email}
          </p>
          <p>
            <span className="text-muted-foreground">Rol:</span> Dueño
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Datos personales</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((data) => mutation.mutate(data))}
            className="space-y-4"
          >
            <Input label="Nombre completo" error={errors.fullName?.message} {...register('fullName')} />
            <Input label="Teléfono" {...register('phone')} />
            <Input label="Dirección" {...register('address')} />

            <div>
              <p className="text-sm font-medium mb-2">Avatar</p>
              <FileUpload value={avatarUrl} onChange={(url) => setValue('avatarUrl', url)} />
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Documento de identidad</p>
              <FileUpload
                value={documentUrl}
                onChange={(url) => setValue('documentUrl', url)}
                accept=".pdf,image/*"
              />
            </div>

            <Button type="submit" loading={mutation.isPending}>
              Guardar cambios
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={user?.profile?.whatsappOptIn ?? false}
                onChange={(e) => whatsappMutation.mutate(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary"
              />
              <span className="text-sm">
                Recibir alertas de vacunas por WhatsApp
              </span>
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
