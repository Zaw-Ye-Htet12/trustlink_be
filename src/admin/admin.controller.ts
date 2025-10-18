import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { VerifyAgentDto } from './dto/verify-agent.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('agents')
  getAgents() {
    return this.adminService.getAllAgents();
  }

  @Get('agents/:id')
  getAgent(@Param('id') id: number) {
    return this.adminService.getAgentById(id);
  }

  @Patch('agents/:id/approve')
  approveAgent(@Param('id') id: number, @Body() dto: VerifyAgentDto) {
    return this.adminService.approveAgent(id, dto);
  }

  @Patch('agents/:id/reject')
  rejectAgent(@Param('id') id: number, @Body() dto: VerifyAgentDto) {
    return this.adminService.rejectAgent(id, dto);
  }

  @Get('users')
  getUsers() {
    return this.adminService.getAllUsers();
  }

  @Patch('users/:id/status')
  updateUserStatus(@Param('id') id: number, @Body() dto: UpdateUserStatusDto) {
    return this.adminService.updateUserStatus(id, dto);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: number) {
    return this.adminService.deleteUser(id);
  }

  @Get('verification-docs')
  getVerificationDocs() {
    return this.adminService.getAllVerificationDocuments();
  }

  @Get('verification-docs/:id')
  getVerificationDoc(@Param('id') id: number) {
    return this.adminService.getVerificationDocumentById(id);
  }
}
