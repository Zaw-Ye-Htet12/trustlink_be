import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AgentProfile } from 'src/agent/agent.entity';
import { CustomerProfile } from 'src/customer/customer.entity';
import { Service } from 'src/agent/service/service.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CustomerProfile, (customer) => customer.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reviewer_id' })
  customer: CustomerProfile;

  @ManyToOne(() => AgentProfile, (agent) => agent.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'agent_id' })
  agent: AgentProfile;

  @ManyToOne(() => Service, (service) => service.reviews, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'service_id' })
  service?: Service;

  @Column({ type: 'int' })
  rating: number;

  @Column({ length: 255, nullable: true })
  title?: string;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
