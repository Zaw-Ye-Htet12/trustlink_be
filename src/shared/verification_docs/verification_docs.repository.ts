import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { VerificationDocument } from './verification_docs.entity';
import { VerificationStatus } from 'src/common/enums/verification-status.enum';

@Injectable()
export class VerificationDocumentRepository extends Repository<VerificationDocument> {
  constructor(private dataSource: DataSource) {
    super(VerificationDocument, dataSource.createEntityManager());
  }

  async findByAgentId(agentId: number): Promise<VerificationDocument[]> {
    return this.find({
      where: { agent: { id: agentId } },
      order: { created_at: 'DESC' },
    });
  }

  async findPendingDocuments(): Promise<VerificationDocument[]> {
    return this.find({
      where: { status: VerificationStatus.PENDING },
      order: { created_at: 'ASC' },
    });
  }
}
