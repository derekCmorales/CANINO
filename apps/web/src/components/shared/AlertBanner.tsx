'use client';

import { Alert } from '@/components/ui/Alert';
import type { HealthRecord } from '@/types';
import { formatDateShort } from '@/lib/utils';
import Link from 'next/link';

interface AlertBannerProps {
  dueSoon: HealthRecord[];
  overdue: HealthRecord[];
  dogId?: string;
}

export function AlertBanner({ dueSoon, overdue, dogId }: AlertBannerProps) {
  if (dueSoon.length === 0 && overdue.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {overdue.length > 0 && (
        <Alert variant="error" title={`${overdue.length} vacuna(s) vencida(s)`}>
          <ul className="list-disc list-inside space-y-1 mt-1">
            {overdue.map((r) => (
              <li key={r.id}>
                {r.title} — vencida
                {r.scheduledDate && ` (${formatDateShort(r.scheduledDate)})`}
              </li>
            ))}
          </ul>
          {dogId && (
            <Link href={`/dogs/${dogId}/health`} className="underline text-sm mt-2 inline-block">
              Ver salud
            </Link>
          )}
        </Alert>
      )}
      {dueSoon.length > 0 && (
        <Alert variant="warning" title={`${dueSoon.length} vacuna(s) próxima(s)`}>
          <ul className="list-disc list-inside space-y-1 mt-1">
            {dueSoon.map((r) => (
              <li key={r.id}>
                {r.title}
                {r.scheduledDate && ` — ${formatDateShort(r.scheduledDate)}`}
              </li>
            ))}
          </ul>
        </Alert>
      )}
    </div>
  );
}
