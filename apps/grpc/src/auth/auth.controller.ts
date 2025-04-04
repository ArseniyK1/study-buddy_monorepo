// // grpc-micro/src/auth.controller.ts
// import { Controller } from '@nestjs/common';
// import { GrpcMethod } from '@nestjs/microservices';
// import { ClientProxy, Client } from '@nestjs/microservices';
// import { Transport } from '@nestjs/microservices';
// import { firstValueFrom } from 'rxjs';
// import { UserListResponse } from 'src/generated-types/auth';

// @Controller()
// export class AuthController {
//   @Client({
//     transport: Transport.TCP,
//     options: {
//       host: 'localhost',
//       port: 3001,
//     },
//   })
//   private authClient: ClientProxy;

//   @GrpcMethod('AuthService', 'FindAllAuthUser')
//   async findAllAuthUsers(): Promise<UserListResponse> {
//     // Перенаправляем запрос в auth-micro через TCP
//     const result = await firstValueFrom(
//       this.authClient.send('findAllAuthUser', {}),
//     );
//     return { users: result };
//   }
// }
// //
import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, GrpcMethod } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthResponse, SignInRequest } from '../../../../shared/generated/auth';

@Controller()
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private auth_service: ClientProxy) {}

  @GrpcMethod('AuthService', 'SignIn')
  async signIn(data: SignInRequest): Promise<AuthResponse> {
    console.log('gRPC SignIn called with:', data);

    const res = await firstValueFrom(
      this.auth_service.send('findAllAuthUser', { name: 'asd' }),
    );
    console.log(res);

    // Ваша логика аутентификации
    return { accessToken: 'Success', ...res };
  }
}
