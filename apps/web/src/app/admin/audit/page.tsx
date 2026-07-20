'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { AuditLog } from '@/types';
import { LABELS } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function AdminAuditPage() {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => apiFetch<AuditLog[]>('/admin/audit-logs?limit=100'),
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
      <h1 className="text-2xl font-bold mb-6">Registro de auditoría</h1>
      <Card>
        <CardHeader>
          <CardTitle>{logs?.length ?? 0} eventos recientes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!logs?.length && (
            <p className="text-muted-foreground text-sm">No hay eventos registrados.</p>
          )}
          {logs?.map((log) => (
            <div key={log.id} className="rounded-xl border border-border p-4 text-sm">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge>{LABELS.auditAction[log.action]}</Badge>
                <span className="font-medium">{log.entity}</span>
                <span className="text-muted-foreground font-mono text-xs">{log.entityId}</span>
              </div>
              <p className="text-muted-foreground">{formatDateTime(log.createdAt)}</p>
              {log.changes && (
                <pre className="mt-2 rounded-lg bg-muted p-2 text-xs overflow-x-auto">
                  {JSON.stringify(log.changes, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
