import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Dog } from './dog.entity';

@Entity('memorials')
export class Memorial {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'dog_id', unique: true })
  dogId!: string;

  @OneToOne(() => Dog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dog_id' })
  dog!: Dog;

  @Column({ name: 'death_date', type: 'date' })
  deathDate!: string;

  @Column({ type: 'text', nullable: true })
  cause?: string | null;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @Column({ name: 'burial_place', nullable: true })
  burialPlace?: string | null;

  @Column({ name: 'burial_address', type: 'text', nullable: true })
  burialAddress?: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude?: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude?: number | null;

  @Column({ name: 'contact_info', type: 'text', nullable: true })
  contactInfo?: string | null;

  @Column({ name: 'timeline_json', type: 'jsonb', default: [] })
  timelineJson!: unknown[];
}
