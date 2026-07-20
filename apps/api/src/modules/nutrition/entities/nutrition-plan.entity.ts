import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { LifeStage } from '../../../common/enums';
import { Dog } from '../../dogs/entities/dog.entity';

@Entity('nutrition_plans')
export class NutritionPlan {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'dog_id' })
  dogId!: string;

  @ManyToOne(() => Dog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dog_id' })
  dog!: Dog;

  @Column({ name: 'life_stage', type: 'enum', enum: LifeStage })
  lifeStage!: LifeStage;

  @Column({ name: 'diet_description', type: 'text' })
  dietDescription!: string;

  @Column({ type: 'text', nullable: true })
  restrictions?: string | null;

  @Column({ name: 'favorite_food', nullable: true })
  favoriteFood?: string | null;

  @Column({ name: 'active_from', type: 'date' })
  activeFrom!: string;

  @Column({ name: 'active_to', type: 'date', nullable: true })
  activeTo?: string | null;
}
