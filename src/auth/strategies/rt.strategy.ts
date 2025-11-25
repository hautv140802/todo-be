import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { configs } from '@/common/constants/configs';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      // 1. Lấy token từ Header (Bearer)
      // Nếu bạn dùng Cookie, hãy thay đổi hàm này để extract từ cookie
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // 2. Secret key riêng cho Refresh Token (Nên để trong .env)
      secretOrKey: configs.rt.secret,

      // 3. QUAN TRỌNG: Cho phép truy cập vào object Request trong hàm validate
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    // Lấy token gốc từ header để gửi xuống Service xử lý

    const refreshToken = req
      ?.get('Authorization')!
      .replace('Bearer', '')
      .trim();

    // Trả về object này, nó sẽ được gán vào req.user
    return {
      ...payload,
      refreshToken,
    };
  }
}
