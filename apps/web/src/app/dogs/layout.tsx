import { OwnerLayout } from '@/components/layout/OwnerLayout';

export default function DogsLayout({ children }: { children: React.ReactNode }) {
  return <OwnerLayout>{children}</OwnerLayout>;
}
