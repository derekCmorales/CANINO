import { AdminLayout } from '@/components/layout/AdminLayout';
import { RoleGuard } from '@/components/shared/RoleGuard';

export default function AdminSectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <AdminLayout>{children}</AdminLayout>
    </RoleGuard>
  );
}
