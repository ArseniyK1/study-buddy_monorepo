import { Body, Controller, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessagePattern } from '@nestjs/microservices';
import { AuthResponse, SignInRequest } from 'shared/generated/auth';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('sign-in')
  signIn(@Body() dto: SignInRequest): Promise<AuthResponse> {
    return this.authService.signIn(dto);
  }

  @MessagePattern('profile')
  getProfile(@Request() req: any) {
    return this.authService.getProfile(req);
  }
}
