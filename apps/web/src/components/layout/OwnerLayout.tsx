'use client';

import type { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface OwnerLayoutProps {
  children: ReactNode;
}

export function OwnerLayout({ children }: OwnerLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar showNotifications />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
