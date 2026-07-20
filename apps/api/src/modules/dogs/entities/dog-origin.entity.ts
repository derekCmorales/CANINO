import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { SourceType } from '../../../common/enums';
import { Dog } from './dog.entity';

@Entity('dog_origins')
export class DogOrigin {
  @PrimaryColumn({ name: 'dog_id' })
  dogId!: string;

  @OneToOne(() => Dog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dog_id' })
  dog!: Dog;

  @Column({ name: 'source_type', type: 'enum', enum: SourceType })
  sourceType!: SourceType;

  @Column({ name: 'source_name' })
  sourceName!: string;

  @Column({ name: 'mother_name', nullable: true })
  motherName?: string | null;

  @Column({ name: 'father_name', nullable: true })
  fatherName?: string | null;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;
}
