import { IsEmail, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  currentPassword: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}
