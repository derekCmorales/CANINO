import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ExerciseIntensity } from '../../../common/enums';
import { Dog } from '../../dogs/entities/dog.entity';

@Entity('exercise_logs')
export class ExerciseLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'dog_id' })
  dogId!: string;

  @ManyToOne(() => Dog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dog_id' })
  dog!: Dog;

  @Column({ name: 'activity_type' })
  activityType!: string;

  @Column({ name: 'duration_minutes', type: 'int' })
  durationMinutes!: number;

  @Column({ type: 'enum', enum: ExerciseIntensity })
  intensity!: ExerciseIntensity;

  @Column({ name: 'logged_at', type: 'date' })
  loggedAt!: string;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;
}
