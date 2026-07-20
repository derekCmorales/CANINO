import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Dog } from './dog.entity';

@Entity('preferences')
export class Preferences {
  @PrimaryColumn({ name: 'dog_id' })
  dogId!: string;

  @OneToOne(() => Dog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dog_id' })
  dog!: Dog;

  @Column({ type: 'text' })
  likes!: string;

  @Column({ name: 'favorite_toys', type: 'text', nullable: true })
  favoriteToys?: string | null;

  @Column({ name: 'favorite_activities', type: 'text', nullable: true })
  favoriteActivities?: string | null;

  @Column({ name: 'favorite_treats', type: 'text', nullable: true })
  favoriteTreats?: string | null;
}
