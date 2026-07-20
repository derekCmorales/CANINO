import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { HealthRecordType, HealthRecordStatus } from '../../../common/enums';
import { Dog } from '../../dogs/entities/dog.entity';
import { User } from '../../users/entities/user.entity';

@Entity('health_records')
export class HealthRecord {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'dog_id' })
  dogId!: string;

  @ManyToOne(() => Dog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dog_id' })
  dog!: Dog;

  @Column({ type: 'enum', enum: HealthRecordType })
  type!: HealthRecordType;

  @Column()
  title!: string;

  @Column({ name: 'scheduled_date', type: 'date', nullable: true })
  scheduledDate?: string | null;

  @Column({ name: 'applied_date', type: 'date', nullable: true })
  appliedDate?: string | null;

  @Column({ type: 'enum', enum: HealthRecordStatus, default: HealthRecordStatus.PENDING })
  status!: HealthRecordStatus;

  @Column({ name: 'veterinarian_id', nullable: true })
  veterinarianId?: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'veterinarian_id' })
  veterinarian?: User | null;

  @Column({ name: 'batch_number', nullable: true })
  batchNumber?: string | null;

  @Column({ type: 'text', nullable: true })
  diagnosis?: string | null;

  @Column({ type: 'text', nullable: true })
  medication?: string | null;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
