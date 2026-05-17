import { OmitType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterUserDTO {
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Please, provide a valid email' })
  email!: string;

  @IsNotEmpty({ message: 'Name cannot be empty' })
  @IsString({ message: 'Name must be string' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(30, { message: 'Name cannot be longer than 30 characters' })
  name!: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  @IsString({ message: 'Password must be string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(20, { message: 'Password cannot be longer than 20 characters' })
  password!: string;
}

export class LoginUserDTO extends OmitType(RegisterUserDTO, [
  'name',
] as const) {}

export class RefTokenDTO {
  @IsNotEmpty({ message: 'Token cannot be empty' })
  @IsString({ message: 'Token must be string' })
  refreshToken!: string;
}
