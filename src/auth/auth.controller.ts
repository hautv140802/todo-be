import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-dto';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  @ResponseMessage('Registered Successfully!')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
