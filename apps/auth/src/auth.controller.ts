import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import {
  AuthResponse,
  AuthServiceController,
  FindAllUsersRequest,
  GetProfileRequest,
  SignInRequest,
  SignUpRequest,
  User,
  UserListResponse,
} from 'shared/generated/auth';

@ApiTags('auth')
@Controller('auth')
export class AuthController implements AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'SignIn')
  async signIn(data: SignInRequest): Promise<AuthResponse> {
    return await this.authService.signIn(data);
  }

  @GrpcMethod('AuthService', 'SignUp')
  async signUp(data: SignUpRequest): Promise<AuthResponse> {
    return await this.authService.signUp(data);
  }

  // TODO: add types, remove any
  @GrpcMethod('AuthService', 'FindAllUsers')
  async findAllUsers(data: FindAllUsersRequest): Promise<any> {
    return await this.authService.findAllUsers(data);
  }

  // TODO: add types, remove any
  @GrpcMethod('AuthService', 'GetProfile')
  async getProfile(data: GetProfileRequest): Promise<any> {
    return await this.authService.getProfile(data);
  }
}
