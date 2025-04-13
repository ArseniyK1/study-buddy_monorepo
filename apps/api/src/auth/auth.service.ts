// import { AuthResponse } from '../../../grpc/src/generated-types/auth';
import { SignInDto } from './dto/sing-in.dto';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { catchError, firstValueFrom, lastValueFrom, Observable } from 'rxjs';
import { AuthResponse } from 'shared/generated/auth';
import { RpcException } from '@nestjs/microservices';
import { Status } from '@grpc/grpc-js/build/src/constants';
interface AuthServiceClient {
  FindAllUsers(request: object): Observable<{ users: any[] }>;
  SignIn(dto: SignInDto): Observable<AuthResponse>;
}

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(@Inject('GRPC_SERVICE') private client: ClientGrpc) {}
  private authService: AuthServiceClient;

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>('AuthService');
  }

  async signIn(dto: SignInDto): Promise<AuthResponse> {
    try {
      // return await lastValueFrom(
      //   this.authService.SignIn(dto).pipe(
      //     catchError((error) => {
      //       // Преобразуем gRPC ошибку в HTTP-ответ
      //       const grpcError = error as { code: number; details: string };

      //       if (grpcError.code === Status.NOT_FOUND) {
      //         throw new NotFoundException(grpcError.details);
      //       }
      //       if (grpcError.code === Status.UNAUTHENTICATED) {
      //         throw new UnauthorizedException(grpcError.details);
      //       }
      //       console.log('Api Controller', error?.code, error?.details);

      //       throw new InternalServerErrorException(error);
      //     }),
      //   ),
      // );
      //
      return await firstValueFrom(this.authService.SignIn(dto));
    } catch (error) {
      // Логируем полную ошибку для отладки
      console.error('Api controller:', JSON.stringify(error));

      // Проверяем, является ли ошибка gRPC ошибкой
      if (error.code && error.details) {
        switch (error.code) {
          case Status.NOT_FOUND: // 5
            throw new NotFoundException(error.details);
          case Status.UNAUTHENTICATED: // 16
            throw new UnauthorizedException(error.details);
          case Status.INVALID_ARGUMENT: // 3
            throw new BadRequestException(error.details);
          default:
            throw new InternalServerErrorException(error.details);
        }
      }

      // Если это не gRPC ошибка, пробрасываем как есть
      throw error;
    }
  }
}
