import { AgentProfile } from 'src/agent/agent.entity';
import { Category } from 'src/category/category.entity';
import { LocationType } from 'src/common/enums/location-type.enum';
import { PricingType } from 'src/common/enums/pricing-type.enum';
import { Review } from 'src/review/review.entity';
import { ServiceImage } from 'src/service_image/service_image.entity';
import { Tag } from 'src/tag/tag.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToMany,
  JoinColumn,
} from 'typeorm';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AgentProfile, (a) => a.services, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agent_id' })
  agent: AgentProfile;

  @Column({ type: 'int' })
  agent_id: number;

  @ManyToOne(() => Category, (category) => category.services, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category?: Category;

  @Column({ type: 'int', nullable: true })
  category_id?: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: PricingType,
    default: 'fixed',
  })
  pricing_type: PricingType;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price?: number;

  @Column({ length: 3, default: 'THB' })
  currency: string;

  @Column({
    type: 'enum',
    enum: LocationType,
    nullable: true,
  })
  location_type?: LocationType;

  @Column({ nullable: true })
  service_area?: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: 0 })
  total_reviews: number;

  @OneToMany(() => ServiceImage, (img) => img.service, { cascade: true })
  images: ServiceImage[];

  @ManyToMany(() => Tag, (tag) => tag.services, { cascade: true })
  @JoinTable({ name: 'service_tags' })
  tags: Tag[];

  @OneToMany(() => Review, (review) => review.service)
  reviews: Review[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
