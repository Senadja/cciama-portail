import { IsBoolean, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { Role, ROLE_VALUES } from '../auth/auth.decorators';

const TEMP_PASSWORD_RULE = { message: 'Le mot de passe provisoire doit contenir au moins 8 caractères.' };

/** Création par un administrateur : identité + mot de passe provisoire à changer. */
export class CreateUserDto {
  @IsString()
  @MinLength(1, { message: 'Le nom est obligatoire.' })
  lastName: string;

  @IsString()
  @MinLength(1, { message: 'Le prénom est obligatoire.' })
  firstName: string;

  @IsString()
  @MinLength(1, { message: 'Le matricule est obligatoire.' })
  matricule: string;

  @IsIn(ROLE_VALUES, { message: 'Rôle inconnu.' })
  role: Role;

  @IsString()
  @MinLength(8, TEMP_PASSWORD_RULE)
  temporaryPassword: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  matricule?: string;

  @IsOptional()
  @IsIn(ROLE_VALUES, { message: 'Rôle inconnu.' })
  role?: Role;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ResetPasswordDto {
  @IsString()
  @MinLength(8, TEMP_PASSWORD_RULE)
  temporaryPassword: string;
}
