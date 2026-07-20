import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Dog } from '../../dogs/entities/dog.entity';

@Entity('memories')
export class Memory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'dog_id' })
  dogId!: string;

  @ManyToOne(() => Dog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dog_id' })
  dog!: Dog;

  @Column({ name: 'photo_url' })
  photoUrl!: string;

  @Column({ type: 'text', nullable: true })
  caption?: string | null;

  @Column({ name: 'memory_date', type: 'date', nullable: true })
  memoryDate?: string | null;

  @Column({ nullable: true })
  people?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
