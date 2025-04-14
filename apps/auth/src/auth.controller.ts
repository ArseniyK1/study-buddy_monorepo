import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import {
  AuthResponse,
  AuthServiceController,
  FindAllUsersRequest,
  SignInRequest,
  SignUpRequest,
  User,
  UserListResponse,
} from 'shared/generated/auth';
import { UInt32Value } from 'shared/generated/google/protobuf/wrappers';

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

  @GrpcMethod('AuthService', 'FindAllUsers')
  async findAllUsers(data: FindAllUsersRequest): Promise<UserListResponse> {
    return await this.authService.findAllUsers(data);
  }

  @GrpcMethod('AuthService', 'GetProfile')
  async getProfile(id: UInt32Value): Promise<User> {
    console.log('Auth Micro', id.value);

    const user = await this.authService.getProfile(id.value);
    if (!user) {
      throw new RpcException('User not found');
    }
    return {
      id: user.id,
      firstName: user.first_name || '',
      lastName: user.second_name || '',
      middleName: user.middle_name || undefined,
      email: user.email,
      roleId: user.role_id,
    };
  }
}
