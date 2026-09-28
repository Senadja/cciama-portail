import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AuthUser, CurrentUser, Roles } from '../auth/auth.decorators';
import { CreateUserDto, ResetPasswordDto, UpdateUserDto } from './users.dto';
import { UsersService } from './users.service';

@Controller('admin/users')
@Roles('ADMIN')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  list() {
    return this.users.list();
  }

  @Post()
  create(@Body() dto: CreateUserDto, @CurrentUser() actor: AuthUser) {
    return this.users.create(dto, actor);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto, @CurrentUser() actor: AuthUser) {
    return this.users.update(id, dto, actor);
  }

  @Post(':id/reset-password')
  resetPassword(@Param('id') id: string, @Body() dto: ResetPasswordDto, @CurrentUser() actor: AuthUser) {
    return this.users.resetPassword(id, dto.temporaryPassword, actor);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() actor: AuthUser) {
    return this.users.remove(id, actor);
  }
}
