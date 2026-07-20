import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Dog } from './dog.entity';

@Entity('baptisms')
export class Baptism {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'dog_id', unique: true })
  dogId!: string;

  @OneToOne(() => Dog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dog_id' })
  dog!: Dog;

  @Column({ name: 'ceremony_date', type: 'date' })
  ceremonyDate!: string;

  @Column({ name: 'assigned_name' })
  assignedName!: string;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @Column({ name: 'photo_urls', type: 'jsonb', default: [] })
  photoUrls!: string[];
}
