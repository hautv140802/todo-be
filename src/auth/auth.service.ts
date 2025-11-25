import {
  ConflictException,
  ForbiddenException,
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
import { configs } from '@/common/constants/configs';
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

  async getToken(userId: number, email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: configs.jwt.secret, expiresIn: configs.jwt.expire as any },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: configs.rt.secret, expiresIn: configs.rt.expire as any },
      ),
    ]);

    return { accessToken: at, refreshToken: rt };
  }

  async updateRefreshToken(userId: number, refreshToken: string | null) {
    const salt = await bcrypt.genSalt(10);
    const hashRt = refreshToken ? await bcrypt.hash(refreshToken, salt) : null;
    await this.usersRepository.update(userId, {
      refresh_token: hashRt,
    });
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

    const { accessToken, refreshToken } = await this.getToken(
      user.id,
      user.email,
    );

    await this.updateRefreshToken(user?.id, refreshToken);

    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(userId: number, currentRefresh: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user || !user.refresh_token) {
      throw new ForbiddenException('Access Denied');
    }

    const isMatchRT = await bcrypt.compare(currentRefresh, user?.refresh_token);

    if (!isMatchRT) {
      await this.updateRefreshToken(user.id, null);
      throw new ForbiddenException('Access Denied: Refresh Token invalid');
    }

    const { accessToken, refreshToken } = await this.getToken(
      user.id,
      user.email,
    );

    await this.updateRefreshToken(user?.id, refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
