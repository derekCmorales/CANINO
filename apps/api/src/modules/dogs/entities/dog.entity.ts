import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { DogGender, DogStatus } from '../../../common/enums';
import { User } from '../../users/entities/user.entity';
import { Breed } from '../../catalogs/entities/breed.entity';
import { DogOrigin } from './dog-origin.entity';
import { Baptism } from './baptism.entity';
import { Preferences } from './preferences.entity';
import { Memorial } from './memorial.entity';

@Entity('dogs')
export class Dog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'owner_id' })
  ownerId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner!: User;

  @Column()
  name!: string;

  @Column({ name: 'breed_id', nullable: true })
  breedId?: string | null;

  @ManyToOne(() => Breed, { nullable: true })
  @JoinColumn({ name: 'breed_id' })
  breed?: Breed | null;

  @Column({ type: 'enum', enum: DogGender })
  gender!: DogGender;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate!: string;

  @Column({ name: 'birth_place', nullable: true })
  birthPlace?: string | null;

  @Column({ name: 'photo_url', nullable: true })
  photoUrl?: string | null;

  @Column({ type: 'enum', enum: DogStatus, default: DogStatus.ACTIVE })
  status!: DogStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToOne(() => DogOrigin, (origin) => origin.dog)
  origin?: DogOrigin;

  @OneToOne(() => Baptism, (baptism) => baptism.dog)
  baptism?: Baptism;

  @OneToOne(() => Preferences, (prefs) => prefs.dog)
  preferences?: Preferences;

  @OneToOne(() => Memorial, (memorial) => memorial.dog)
  memorial?: Memorial;
}
