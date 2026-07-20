'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { Breed, CreateDogDto, Dog, DogGender } from '@/types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/shared/FileUpload';

const schema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  breedId: z.string().optional(),
  gender: z.enum(['male', 'female'] as const),
  birthDate: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
  birthPlace: z.string().optional(),
  photoUrl: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface DogFormProps {
  dog?: Dog;
  onSubmit: (data: CreateDogDto) => Promise<void>;
  loading?: boolean;
}

export function DogForm({ dog, onSubmit, loading }: DogFormProps) {
  const { data: breeds = [] } = useQuery({
    queryKey: ['breeds'],
    queryFn: () => apiFetch<Breed[]>('/catalogs/breeds', { auth: false }),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: dog?.name ?? '',
      breedId: dog?.breedId ?? '',
      gender: (dog?.gender ?? 'male') as DogGender,
      birthDate: dog?.birthDate?.slice(0, 10) ?? '',
      birthPlace: dog?.birthPlace ?? '',
      photoUrl: dog?.photoUrl ?? '',
    },
  });

  const photoUrl = watch('photoUrl');

  return (
    <form
      onSubmit={handleSubmit((data) =>
        onSubmit({
          ...data,
          gender: data.gender as DogGender,
          breedId: data.breedId || undefined,
        }),
      )}
      className="space-y-5"
    >
      <Input label="Nombre" error={errors.name?.message} {...register('name')} />

      <Select
        label="Raza"
        placeholder="Selecciona una raza"
        options={breeds.map((b) => ({ value: b.id, label: b.name }))}
        error={errors.breedId?.message}
        {...register('breedId')}
      />

      <Select
        label="Sexo"
        options={[
          { value: 'male', label: 'Macho' },
          { value: 'female', label: 'Hembra' },
        ]}
        error={errors.gender?.message}
        {...register('gender')}
      />

      <Input
        label="Fecha de nacimiento"
        type="date"
        error={errors.birthDate?.message}
        {...register('birthDate')}
      />

      <Input label="Lugar de nacimiento" {...register('birthPlace')} />

      <div>
        <p className="text-sm font-medium mb-2">Foto</p>
        <FileUpload
          value={photoUrl}
          onChange={(url) => setValue('photoUrl', url)}
          accept="image/*"
        />
      </div>

      <Button type="submit" loading={loading} className="w-full sm:w-auto">
        {dog ? 'Guardar cambios' : 'Registrar perro'}
      </Button>
    </form>
  );
}
