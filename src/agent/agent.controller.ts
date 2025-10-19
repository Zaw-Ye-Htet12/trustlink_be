import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AgentService } from './agent.service';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { SubmitVerificationDocumentDto } from './dto/submit-documents.dto';
import { VerificationDocument } from 'src/shared/verification_docs/verification_docs.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
import { AgentProfileResponse } from './dto/response/agent-profile.dto';
import { Review } from 'src/shared/review/review.entity';

interface RequestWithUser extends Request {
  user: {
    sub: number;
    email: string;
    role: UserRole;
  };
}

@Controller('agent')
@UseGuards(AuthGuard('jwt'))
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Get('profile')
  async getProfile(@Req() req: RequestWithUser): Promise<AgentProfileResponse> {
    const user = req.user as { sub: number; role: string };
    return this.agentService.getProfile(user.sub);
  }

  // Agent: Update my profile
  @Patch('profile')
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() dto: UpdateAgentDto,
  ): Promise<AgentProfileResponse | null> {
    const user = req.user as { sub: number; role: string };
    return this.agentService.updateProfile(user.sub, dto);
  }

  // Agent: Submit verification document
  @Post('verification')
  async submitVerification(
    @Req() req: RequestWithUser,
    @Body() dto: SubmitVerificationDocumentDto,
  ): Promise<VerificationDocument> {
    const user = req.user as { sub: number; role: string };
    return this.agentService.submitVerification(user.sub, dto);
  }

  @Get('verification/status')
  async getVerificationStatus(@Req() req: RequestWithUser) {
    const user = req.user as { sub: number; role: string };
    return this.agentService.getVerificationStatus(user.sub);
  }

  @Get('reviews')
  async getMyReviews(@Req() req: RequestWithUser): Promise<Review[]> {
    const user = req.user as { sub: number };
    return this.agentService.getMyReviews(user.sub);
  }

  @Get('reviews/summary')
  async getReviewSummary(@Req() req: RequestWithUser) {
    const user = req.user as { sub: number };
    return this.agentService.getReviewSummary(user.sub);
  }

  // Public: Get specific agent profile
  @Get('profile/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.agentService.getAgentById(id);
  }
}
