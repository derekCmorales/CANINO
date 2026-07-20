import { VetLayout } from '@/components/layout/VetLayout';
import { RoleGuard } from '@/components/shared/RoleGuard';

export default function VetSectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['veterinarian', 'admin']}>
      <VetLayout>{children}</VetLayout>
    </RoleGuard>
  );
}
