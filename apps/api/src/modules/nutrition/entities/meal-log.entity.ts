import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Dog } from '../../dogs/entities/dog.entity';

@Entity('meal_logs')
export class MealLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'dog_id' })
  dogId!: string;

  @ManyToOne(() => Dog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dog_id' })
  dog!: Dog;

  @Column({ name: 'meal_type' })
  mealType!: string;

  @Column({ nullable: true })
  brand?: string | null;

  @Column({ nullable: true })
  portion?: string | null;

  @Column({ name: 'logged_at', type: 'timestamptz', default: () => 'NOW()' })
  loggedAt!: Date;
}
