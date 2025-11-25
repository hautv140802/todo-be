import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { configs } from '@/common/constants/configs';
import { RtStrategy } from './strategies/rt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: configs.jwt.secret,
        signOptions: {
          expiresIn: (configs.jwt.expire as any) || '1d',
        },
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService, RtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
