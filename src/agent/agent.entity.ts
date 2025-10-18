import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { VerificationStatus } from 'src/common/enums/verification-status.enum';
import { User } from 'src/users/user.entity';
import { Review } from 'src/review/review.entity';
import { Service } from './service/service.entity';

@Entity('agent_profiles')
export class AgentProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  verification_status: VerificationStatus;

  @Column({ nullable: true, type: 'text' })
  bio: string;

  @Column({ nullable: true })
  years_of_experience: number;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  service_area: string;

  @Column({ nullable: true })
  profile_photo_url: string;

  @Column({ default: 0 })
  total_reviews: number;

  @Column({ default: 0 })
  follower_count: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(() => Service, (service) => service.agent)
  services: Service[];

  @OneToMany(() => Review, (review) => review.agent)
  reviews: Review[];
}
