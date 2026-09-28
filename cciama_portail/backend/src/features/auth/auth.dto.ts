import { IsEmail, IsString, MinLength } from 'class-validator';

const PASSWORD_RULE = { message: 'Le mot de passe doit contenir au moins 8 caractères.' };

export class LoginDto {
  /** Adresse e-mail ou matricule. */
  @IsString()
  @MinLength(1)
  identifier: string;

  @IsString()
  @MinLength(1)
  password: string;
}

/** Première connexion : l'utilisateur choisit son e-mail et remplace le mot de passe provisoire. */
export class CompleteAccountDto {
  @IsEmail({}, { message: 'Adresse e-mail invalide.' })
  email: string;

  @IsString()
  @MinLength(8, PASSWORD_RULE)
  newPassword: string;
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(1)
  currentPassword: string;

  @IsString()
  @MinLength(8, PASSWORD_RULE)
  newPassword: string;
}
