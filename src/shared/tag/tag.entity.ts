import { Service } from 'src/agent/service/service.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  name: string;

  @Column({ length: 50, nullable: true })
  slug?: string;

  @ManyToMany(() => Service, (service) => service.tags)
  services: Service[];
}
