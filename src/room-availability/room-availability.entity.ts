// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   JoinColumn,
// } from 'typeorm';
// import { RoomType } from './../room-types/room-type.entity';

// @Entity('room_availability')
// export class RoomAvailability {
//   @PrimaryGeneratedColumn()
//   availability_id: number;

//   @Column()
//   room_type_id: number;

//   @Column({ type: 'date' })
//   date: Date;

//   @Column({ type: 'boolean', default: true })
//   is_available: boolean;

//   @ManyToOne(() => RoomType, (roomType) => roomType.availability)
//   @JoinColumn({ name: 'room_type_id' })
//   roomType: RoomType;
// }
