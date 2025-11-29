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
import { VALIDATION_MESSAGES } from '@/common/constants/validation-messages';
import { LoginDto } from './dto/login-dto';
import { JwtService } from '@nestjs/jwt';
import { configs } from '@/common/constants/configs';
import { hash, Options, argon2id, verify } from 'argon2';
const ARGON2_OPTIONS: Options = {
  type: argon2id,
  memoryCost: 2 ** 16,
  timeCost: 4,
  parallelism: 1,
};
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { fullName, email, password } = registerDto;
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(VALIDATION_MESSAGES.EMAIL_USED);
    }

    const hashedPassword = await hash(password, ARGON2_OPTIONS);

    const newUser = this.usersRepository.create({
      fullName,
      email,
      password: hashedPassword,
    });

    try {
      const savedUser = await this.usersRepository.save(newUser);

      const { password, refreshToken, ...result } = savedUser;
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
    let hashRt: string | null = null;
    if (refreshToken) {
      hashRt = await hash(refreshToken, ARGON2_OPTIONS);
    }
    await this.usersRepository.update(userId, {
      refreshToken: hashRt || undefined,
    });
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: {
        email: loginDto.email,
      },
      select: ['id', 'email', 'fullName', 'password'],
    });

    if (!user?.password) {
      throw new ForbiddenException('Access Denied');
    }

    const isMatch = await verify(user?.password, loginDto.password);

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
      fullName: user.fullName,
      email: user.email,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async refreshToken(userId: number, currentRefresh: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const isMatchRT = await verify(user?.refreshToken, currentRefresh);

    if (!isMatchRT) {
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
