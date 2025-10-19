import { DocumentType } from 'src/common/enums/document-type.enum';
import { VerificationStatus } from 'src/common/enums/verification-status.enum';
import { AgentProfile } from 'src/agent/agent.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity('verification_documents')
export class VerificationDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AgentProfile, (agent) => agent.verificationDocuments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'agent_id' })
  agent: AgentProfile;

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
