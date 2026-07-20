import { VetLayout } from '@/components/layout/VetLayout';
import { RoleGuard } from '@/components/shared/RoleGuard';
import { UserRole } from '@/types';

export default function VetSectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[UserRole.VETERINARIAN, UserRole.ADMIN]}>
      <VetLayout>{children}</VetLayout>
    </RoleGuard>
  );
}
