import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto, CompleteAccountDto, LoginDto } from './auth.dto';
import { AllowIncompleteAccount, AuthUser, CurrentUser, Public } from './auth.decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.identifier, dto.password);
  }

  @Get('me')
  @AllowIncompleteAccount()
  me(@CurrentUser() user: AuthUser) {
    return this.authService.me(user.id);
  }

  @Post('complete-account')
  @AllowIncompleteAccount()
  completeAccount(@CurrentUser() user: AuthUser, @Body() dto: CompleteAccountDto) {
    return this.authService.completeAccount(user.id, dto.email, dto.newPassword);
  }

  @Post('change-password')
  changePassword(@CurrentUser() user: AuthUser, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(user.id, dto.currentPassword, dto.newPassword);
  }
}
