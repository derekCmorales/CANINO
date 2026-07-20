'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import type { Notification } from '@/types';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function NotificationBell() {
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => apiFetch<Notification[]>('/notifications'),
    refetchInterval: 60000,
  });

  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <Link
      href="/notifications"
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted transition-colors"
      aria-label={`Notificaciones${unread ? `, ${unread} sin leer` : ''}`}
    >
      <Bell className="h-5 w-5 text-muted-foreground" />
      {unread > 0 && (
        <Badge
          variant="destructive"
          className="absolute -right-1 -top-1 h-5 min-w-5 justify-center px-1 text-[10px]"
        >
          {unread > 9 ? '9+' : unread}
        </Badge>
      )}
    </Link>
  );
}
