import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Amenity } from 'src/amenities/amenity.entity';

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

  @Column({ type: 'json', nullable: true })
  available_dates: string[];

  @Column({ type: 'json', nullable: true })
  images: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => Amenity, (amenity) => amenity.roomTypes)
  @JoinTable({
    name: 'room_type_amenities',
    joinColumn: { name: 'room_type_id', referencedColumnName: 'room_type_id' },
    inverseJoinColumn: {
      name: 'amenity_id',
      referencedColumnName: 'amenity_id',
    },
  })
  amenities: Amenity[];
}
