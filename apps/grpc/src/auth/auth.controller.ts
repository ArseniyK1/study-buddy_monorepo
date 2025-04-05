import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  Controller,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy, GrpcMethod, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  AuthResponse,
  AuthServiceControllerMethods,
  SignInRequest,
} from 'shared/generated/auth';

@Controller()
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private auth_service: ClientProxy) {}

  @GrpcMethod('AuthService', 'SignIn')
  async signIn(data: SignInRequest): Promise<AuthResponse> {
    const res = await firstValueFrom(
      this.auth_service.send('sign-in', {
        email: data.email,
        password: data.password,
      }),
    );
    return res;
  }
}
