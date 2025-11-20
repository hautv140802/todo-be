import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-dto';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';
import { LoginDto } from './dto/login-dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  @ResponseMessage('Registered Successfully!')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ResponseMessage('Login Successfully!')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // @Post('refresh-token')
  // @ResponseMessage('Refresh Token Successfully!')
  // @HttpCode(HttpStatus.OK)
  // async refreshToken() {}
}
