'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getDashboardPath } from '@/lib/auth';
import type { UserRole } from '@/types';
import { LoadingSpinner } from './LoadingSpinner';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
}

export function RoleGuard({ children, allowedRoles, fallbackPath }: RoleGuardProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (!user) {
        router.replace('/login');
        return;
      }
      if (!allowedRoles.includes(user.role)) {
        router.replace(fallbackPath ?? getDashboardPath(user.role, user.adminSubtype));
        return;
      }
      setAuthorized(true);
      setReady(true);
    });
  }, [allowedRoles, fallbackPath, router]);

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
}
