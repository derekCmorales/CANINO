import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { WardrobeItemType } from '../../../common/enums';
import { Dog } from '../../dogs/entities/dog.entity';

@Entity('wardrobe_items')
export class WardrobeItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'dog_id' })
  dogId!: string;

  @ManyToOne(() => Dog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dog_id' })
  dog!: Dog;

  @Column({ name: 'item_type', type: 'enum', enum: WardrobeItemType })
  itemType!: WardrobeItemType;

  @Column()
  name!: string;

  @Column({ nullable: true })
  size?: string | null;

  @Column({ nullable: true })
  color?: string | null;

  @Column({ name: 'photo_url', nullable: true })
  photoUrl?: string | null;

  @Column({ name: 'is_favorite', default: false })
  isFavorite!: boolean;
}
