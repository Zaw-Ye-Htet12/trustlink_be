import { Service } from 'src/agent/service/service.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity('service_images')
export class ServiceImage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Service, (s) => s.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @Column({ type: 'int' })
  service_id: number;

  @Column({ length: 500 })
  image_url: string;

  @Column({ default: false })
  is_primary: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
