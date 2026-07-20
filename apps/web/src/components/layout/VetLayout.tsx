'use client';

import type { ReactNode } from 'react';
import {
  LayoutDashboard,
  Dog,
  Stethoscope,
  LogOut,
} from 'lucide-react';
import { Sidebar, MobileSidebarNav, type SidebarItem } from './Sidebar';
import { clearAuth } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const vetItems: SidebarItem[] = [
  { href: '/vet', label: 'Panel', icon: LayoutDashboard },
  { href: '/vet/dogs', label: 'Perros', icon: Dog },
];

interface VetLayoutProps {
  children: ReactNode;
}

export function VetLayout({ children }: VetLayoutProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      /* ignore */
    }
    clearAuth();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar items={vetItems} title="Panel Veterinario" />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Stethoscope className="h-6 w-6 text-primary lg:hidden" />
            <Link href="/vet" className="font-bold text-primary lg:hidden">
              Portal Canino — Vet
            </Link>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-1" />
            Salir
          </Button>
        </header>
        <div className="border-b border-border px-4 py-3 lg:hidden">
          <MobileSidebarNav items={vetItems} />
        </div>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
