import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Dog } from '../../dogs/entities/dog.entity';

@Entity('growth_records')
export class GrowthRecord {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'dog_id' })
  dogId!: string;

  @ManyToOne(() => Dog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dog_id' })
  dog!: Dog;

  @Column({ name: 'weight_kg', type: 'decimal', precision: 5, scale: 2 })
  weightKg!: number;

  @Column({ name: 'recorded_at', type: 'date' })
  recordedAt!: string;
}
