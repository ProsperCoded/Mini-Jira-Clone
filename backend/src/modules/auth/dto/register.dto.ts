import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { PasswordUtil } from '../../../utils/password.util';

export class RegisterDto {
  @IsEmail({}, { message: 'A valid email is required' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Username should not be empty' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Password should not be empty' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  validatePassword() {
    const { isValid, errors } = PasswordUtil.validatePassword(this.password);
    if (!isValid) {
      throw new Error(errors.join(', '));
    }
  }
}
