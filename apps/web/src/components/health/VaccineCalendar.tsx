'use client';

import type { HealthRecord } from '@/types';
import { LABELS } from '@/types';
import { formatDateShort } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface VaccineCalendarProps {
  records: HealthRecord[];
}

function statusVariant(status: HealthRecord['status']) {
  switch (status) {
    case 'applied':
      return 'success' as const;
    case 'overdue':
      return 'destructive' as const;
    default:
      return 'warning' as const;
  }
}

export function VaccineCalendar({ records }: VaccineCalendarProps) {
  const vaccines = records.filter((r) => r.type === 'vaccine');

  if (vaccines.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Calendar className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p>No hay vacunas registradas aún.</p>
        </CardContent>
      </Card>
    );
  }

  const sorted = [...vaccines].sort((a, b) => {
    const dateA = a.scheduledDate ?? a.appliedDate ?? a.createdAt;
    const dateB = b.scheduledDate ?? b.appliedDate ?? b.createdAt;
    return new Date(dateA).getTime() - new Date(dateB).getTime();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Calendario de vacunas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sorted.map((record) => (
          <div
            key={record.id}
            className="flex items-start gap-3 rounded-xl border border-border p-4"
          >
            <div className="mt-0.5">
              {record.status === 'applied' ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : record.status === 'overdue' ? (
                <AlertTriangle className="h-5 w-5 text-destructive" />
              ) : (
                <Calendar className="h-5 w-5 text-warning" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{record.title}</p>
                <Badge variant={statusVariant(record.status)}>
                  {LABELS.healthStatus[record.status]}
                </Badge>
              </div>
              <div className="mt-1 text-sm text-muted-foreground space-y-0.5">
                {record.scheduledDate && (
                  <p>Programada: {formatDateShort(record.scheduledDate)}</p>
                )}
                {record.appliedDate && (
                  <p>Aplicada: {formatDateShort(record.appliedDate)}</p>
                )}
                {record.batchNumber && <p>Lote: {record.batchNumber}</p>}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
