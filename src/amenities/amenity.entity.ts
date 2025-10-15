import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';
import { RoomType } from '../room-types/room-type.entity';

@Entity('amenities')
export class Amenity {
  @PrimaryGeneratedColumn()
  amenity_id: number;

  @Column({ unique: true })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToMany(() => RoomType, (roomType) => roomType.amenities)
  roomTypes: RoomType[];
}
