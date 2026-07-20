'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { User, UserRole, AdminSubtype } from '@/types';
import { LABELS } from '@/types';
import { formatDateShort } from '@/lib/utils';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
export default function AdminUsersPage() {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => apiFetch<User[]>('/users'),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiFetch<User>(`/users/${id}/status`, { method: 'PATCH', body: { isActive } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const roleMutation = useMutation({
    mutationFn: ({
      id,
      role,
      adminSubtype,
    }: {
      id: string;
      role: UserRole;
      adminSubtype?: AdminSubtype;
    }) =>
      apiFetch<User>(`/users/${id}/role`, {
        method: 'PATCH',
        body: { role, adminSubtype },
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
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
      <h1 className="text-2xl font-bold mb-6">Gestión de usuarios</h1>
      <Card>
        <CardHeader>
          <CardTitle>{users?.length ?? 0} usuarios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {users?.map((user) => (
            <div
              key={user.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border p-4"
            >
              <div>
                <p className="font-medium">{user.profile?.fullName ?? user.email}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge>{LABELS.userRole[user.role]}</Badge>
                  {user.adminSubtype && (
                    <Badge variant="outline">{LABELS.adminSubtype[user.adminSubtype]}</Badge>
                  )}
                  <Badge variant={user.isActive ? 'success' : 'destructive'}>
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Registro: {formatDateShort(user.createdAt)}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    statusMutation.mutate({ id: user.id, isActive: !user.isActive })
                  }
                >
                  {user.isActive ? 'Desactivar' : 'Activar'}
                </Button>
                <select
                  className="rounded-lg border border-border px-2 py-1 text-sm"
                  value={user.role}
                  onChange={(e) => {
                    const role = e.target.value as UserRole;
                    roleMutation.mutate({
                      id: user.id,
                      role,
                      adminSubtype: role === 'admin' ? 'operations' : undefined,
                    });
                  }}
                >
                  {Object.entries(LABELS.userRole).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
