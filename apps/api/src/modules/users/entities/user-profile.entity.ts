import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'full_name' })
  fullName!: string;

  @Column({ nullable: true })
  phone?: string | null;

  @Column({ type: 'text', nullable: true })
  address?: string | null;

  @Column({ name: 'document_url', nullable: true })
  documentUrl?: string | null;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl?: string | null;

  @Column({ name: 'whatsapp_opt_in', default: false })
  whatsappOptIn!: boolean;
}
