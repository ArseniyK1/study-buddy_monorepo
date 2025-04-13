import { Body, Controller, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GrpcMethod, MessagePattern } from '@nestjs/microservices';
import { AuthResponse, SignInRequest } from 'shared/generated/auth';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'SignIn')
  async signIn(data: SignInRequest): Promise<AuthResponse> {
    return await this.authService.signIn(data);
  }
}
