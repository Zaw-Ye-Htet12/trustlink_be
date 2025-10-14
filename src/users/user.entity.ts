import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['admin', 'organizer'], default: 'organizer' })
  role: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: false })
  isAdmin: boolean;

  @CreateDateColumn()
  created_at: Date;
}
