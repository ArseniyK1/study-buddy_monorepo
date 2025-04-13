import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  Controller,
  HttpException,
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
  async signIn(data: SignInRequest) {
    try {
      const res = await firstValueFrom(
        this.auth_service.send('sign-in', {
          email: data.email,
          password: data.password,
        }),
      );
      console.log('GRPC controller', res);

      return res;
    } catch (e) {
      console.log('GRPC controller error:', e.code || Status.INTERNAL);

      // Otherwise, wrap it in an RpcException
      // throw new RpcException({
      //   code: e.code || Status.INTERNAL,
      //   message: e.details || e.message || 'Internal server error',
      // });
      throw new HttpException(
        e.message || 'Internal server error',
        e.code || Status.INTERNAL,
      );
    }
  }
}
