import { OwnerLayout } from '@/components/layout/OwnerLayout';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <OwnerLayout>{children}</OwnerLayout>;
}
