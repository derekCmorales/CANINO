'use client';

import type { ReactNode } from 'react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  Dog,
  Shield,
  LogOut,
} from 'lucide-react';
import { Sidebar, MobileSidebarNav, type SidebarItem } from './Sidebar';
import { clearAuth } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const adminItems: SidebarItem[] = [
  { href: '/admin/overview', label: 'Resumen', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Usuarios', icon: Users },
  { href: '/admin/catalogs', label: 'Catálogos', icon: BookOpen },
  { href: '/admin/dogs', label: 'Perros', icon: Dog },
  { href: '/admin/audit', label: 'Auditoría', icon: FileText },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
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
      <Sidebar items={adminItems} title="Administración" />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary lg:hidden" />
            <Link href="/admin/overview" className="font-bold text-primary lg:hidden">
              Portal Canino — Admin
            </Link>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-1" />
            Salir
          </Button>
        </header>
        <div className="border-b border-border px-4 py-3 lg:hidden">
          <MobileSidebarNav items={adminItems} />
        </div>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
