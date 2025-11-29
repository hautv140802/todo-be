import { VALIDATION_MESSAGES } from '@/common/constants/validation-messages';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';

export class RegisterDto {
  @Expose({ name: 'full_name' })
  @IsString({ message: VALIDATION_MESSAGES.IS_STRING('fullName') })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.IS_EMPTY('fullName') })
  fullName: string;

  @IsEmail({}, { message: VALIDATION_MESSAGES.EMAIL_INVALID })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.IS_EMPTY('email') })
  email: string;

  @MinLength(6, { message: VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH(6) })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.IS_EMPTY('password') })
  password: string;
}
