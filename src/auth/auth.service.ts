import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register-dto';
import * as bcrypt from 'bcrypt';
import { VALIDATION_MESSAGES } from '@/common/constants/validation-messages';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async register(registerDto: RegisterDto) {
    const { full_name, email, password } = registerDto;
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(VALIDATION_MESSAGES.EMAIL_USED);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = this.usersRepository.create({
      full_name,
      email,
      password: hashedPassword,
    });

    try {
      const savedUser = await this.usersRepository.save(newUser);

      const { password, ...result } = savedUser;
      return result as Omit<User, 'password'>;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        VALIDATION_MESSAGES.INTERNAL_ERROR,
      );
    }
  }
}
