import { UserRole } from 'src/common/enums/user-role.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToOne,
} from 'typeorm';
import { CustomerProfile } from '../customer/customer.entity';
import { AgentProfile } from '../agent/agent.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
@Index(['email'])
@Index(['role'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 255 })
  email: string;

  @Exclude()
  @Column({ length: 255 })
  password_hash: string;

  @Column({ length: 255 })
  username: string;

  @Column({ length: 20, nullable: true })
  phone_no: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => CustomerProfile, (c) => c.user)
  customerProfile?: CustomerProfile;

  @OneToOne(() => AgentProfile, (a) => a.user)
  agentProfile?: AgentProfile;
}
