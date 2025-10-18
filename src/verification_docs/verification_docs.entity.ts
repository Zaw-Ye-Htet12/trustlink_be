import { DocumentType } from 'src/common/enums/document-type.enum';
import { VerificationStatus } from 'src/common/enums/verification-status.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('verification_documents')
export class VerificationDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'agent_id', type: 'int' })
  agent_id: number;

  @Column({
    type: 'enum',
    enum: DocumentType,
  })
  document_type: DocumentType;

  @Column({ length: 500 })
  document_url: string;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  status: VerificationStatus;

  @Column({ type: 'text', nullable: true })
  admin_notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
