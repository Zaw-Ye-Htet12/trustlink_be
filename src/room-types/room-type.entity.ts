import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { RoomAvailability } from '../../src/room-availability/room-availability.entity';

@Entity('room_types')
export class RoomType {
  @PrimaryGeneratedColumn()
  room_type_id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  capacity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price_per_day: number;

  @Column({ length: 255, nullable: true })
  address: string;

  @Column({ type: 'text', nullable: true })
  amenities: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => RoomAvailability, (availability) => availability.roomType)
  availability: RoomAvailability[];
}
