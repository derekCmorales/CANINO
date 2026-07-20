'use client';

import { cn } from '@/lib/utils';
import { clearAuth } from '@/lib/auth';
import { resolveFileUrl } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Dog, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import type { User } from '@/types';
import { NotificationBell } from './NotificationBell';
import { Button } from '@/components/ui/Button';

interface NavbarProps {
  title?: string;
  showNotifications?: boolean;
}

export function Navbar({ title = 'Portal Canino', showNotifications = false }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => apiFetch<User>('/auth/me'),
  });

  const handleLogout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      /* ignore */
    }
    clearAuth();
    router.push('/login');
  };

  const navLinks = [
    { href: '/dashboard', label: 'Inicio' },
    { href: '/dogs', label: 'Mis perros' },
    { href: '/profile', label: 'Perfil' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-primary">
          <Dog className="h-7 w-7" />
          <span className="hidden sm:inline">{title}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                pathname.startsWith(link.href)
                  ? 'bg-secondary text-secondary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {showNotifications && <NotificationBell />}
          {user?.profile && (
            <div className="hidden sm:flex items-center gap-2 text-sm">
              {user.profile.avatarUrl ? (
                <img
                  src={resolveFileUrl(user.profile.avatarUrl)}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-xs font-bold">
                  {user.profile.fullName.charAt(0)}
                </div>
              )}
              <span className="max-w-[120px] truncate">{user.profile.fullName}</span>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={handleLogout} aria-label="Cerrar sesión">
            <LogOut className="h-4 w-4" />
          </Button>
          <button
            type="button"
            className="md:hidden rounded-lg p-2 hover:bg-muted"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-border px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'block rounded-lg px-3 py-2 text-sm font-medium',
                pathname.startsWith(link.href) ? 'bg-secondary' : 'hover:bg-muted',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
