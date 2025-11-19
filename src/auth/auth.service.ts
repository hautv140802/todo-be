import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register-dto';
import * as bcrypt from 'bcrypt';
import { VALIDATION_MESSAGES } from '@/common/constants/validation-messages';
import { LoginDto } from './dto/login-dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
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

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: {
        email: loginDto.email,
      },
      select: ['id', 'email', 'full_name', 'password'],
    });

    const isMatch = await bcrypt.compare(loginDto.password, user?.password);

    if (!user || !isMatch)
      throw new UnauthorizedException(
        VALIDATION_MESSAGES.EMAIL_OR_PASSWORD_INCORRECT,
      );

    const payload = { email: user.email, sub: user.id };

    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      access_token: this.jwtService.sign(payload),
    };
  }
}
