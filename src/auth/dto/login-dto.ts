import { VALIDATION_MESSAGES } from '@/common/constants/validation-messages';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: VALIDATION_MESSAGES.EMAIL_INVALID })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.IS_EMPTY('email') })
  email: string;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.IS_EMPTY('password') })
  password: string;
}
