import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './auth.dto';
import { Unprotected } from 'nest-keycloak-connect';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Unprotected()
  async login(@Body() body: any) {
    const { email, password } = body;
    if (!email || !password) {
      throw new UnauthorizedException('Email and password are required');
    }
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('change-password')
  @Unprotected()
  async changePassword(@Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(
      dto.email,
      dto.currentPassword,
      dto.newPassword,
    );
  }
}
