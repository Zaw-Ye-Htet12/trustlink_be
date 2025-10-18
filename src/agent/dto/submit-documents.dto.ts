import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { DocumentType } from '../../common/enums/document-type.enum';

export class SubmitVerificationDocumentDto {
  @IsEnum(DocumentType)
  @IsNotEmpty()
  document_type: DocumentType;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  document_url: string;

  @IsOptional()
  @IsString()
  admin_notes?: string;
}
