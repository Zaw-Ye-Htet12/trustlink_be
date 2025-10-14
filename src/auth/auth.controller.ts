import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';

// Extend Express Request to include user property
interface RequestWithUser extends Request {
  user: {
    sub: number;
    email: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  refresh(@Req() req: RequestWithUser) {
    const userId = req.user.sub;
    return this.authService.refreshTokens(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  logout() {
    return this.authService.logout();
  }
}
