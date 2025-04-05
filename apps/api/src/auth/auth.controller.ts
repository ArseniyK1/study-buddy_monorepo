import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sing-in.dto';
import { Observable } from 'rxjs';
// Так делать не нужно, в папку dist попадает еще и grpc собранный, запуск проекта ломается
// Чтобы исправить, как вариант - сделать монорепо
import { AuthResponse } from '../../../../shared/generated/auth';
import { Public } from './guard/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signIn')
  signIn(@Body() dto: SignInDto): Promise<AuthResponse> {
    return this.authService.signIn(dto);
  }
}
