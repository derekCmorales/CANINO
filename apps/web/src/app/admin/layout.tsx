import { AdminLayout } from '@/components/layout/AdminLayout';
import { RoleGuard } from '@/components/shared/RoleGuard';
import { UserRole } from '@/types';

export default function AdminSectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[UserRole.ADMIN]}>
      <AdminLayout>{children}</AdminLayout>
    </RoleGuard>
  );
}
