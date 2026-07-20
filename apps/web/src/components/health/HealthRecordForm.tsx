'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { CreateHealthRecordDto, HealthRecord, HealthRecordType, HealthRecordStatus } from '@/types';
import { LABELS } from '@/types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

const schema = z.object({
  type: z.enum(['vaccine', 'consultation', 'medication', 'allergy'] as const),
  title: z.string().min(1, 'El título es obligatorio'),
  scheduledDate: z.string().optional(),
  appliedDate: z.string().optional(),
  status: z.enum(['pending', 'applied', 'overdue'] as const).optional(),
  batchNumber: z.string().optional(),
  diagnosis: z.string().optional(),
  medication: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface HealthRecordFormProps {
  record?: HealthRecord;
  onSubmit: (data: CreateHealthRecordDto) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export function HealthRecordForm({ record, onSubmit, onCancel, loading }: HealthRecordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: record?.type ?? 'vaccine',
      title: record?.title ?? '',
      scheduledDate: record?.scheduledDate?.slice(0, 10) ?? '',
      appliedDate: record?.appliedDate?.slice(0, 10) ?? '',
      status: record?.status ?? 'pending',
      batchNumber: record?.batchNumber ?? '',
      diagnosis: record?.diagnosis ?? '',
      medication: record?.medication ?? '',
      notes: record?.notes ?? '',
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) =>
        onSubmit({
          ...data,
          type: data.type as HealthRecordType,
          status: data.status as HealthRecordStatus | undefined,
        }),
      )}
      className="space-y-4"
    >
      <Select
        label="Tipo"
        options={Object.entries(LABELS.healthType).map(([value, label]) => ({
          value,
          label,
        }))}
        error={errors.type?.message}
        {...register('type')}
      />

      <Input label="Título" error={errors.title?.message} {...register('title')} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Fecha programada" type="date" {...register('scheduledDate')} />
        <Input label="Fecha aplicada" type="date" {...register('appliedDate')} />
      </div>

      <Select
        label="Estado"
        options={Object.entries(LABELS.healthStatus).map(([value, label]) => ({
          value,
          label,
        }))}
        {...register('status')}
      />

      <Input label="Número de lote" {...register('batchNumber')} />
      <Input label="Diagnóstico" {...register('diagnosis')} />
      <Input label="Medicamento" {...register('medication')} />
      <Textarea label="Notas" rows={3} {...register('notes')} />

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {record ? 'Actualizar' : 'Registrar'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
