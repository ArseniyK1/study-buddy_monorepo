// import { AuthResponse } from '../../../grpc/src/generated-types/auth';
import { SignInDto } from './dto/sing-in.dto';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { catchError, lastValueFrom, Observable } from 'rxjs';
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

  async signIn(dto: SignInDto) {
    try {
      return await lastValueFrom(
        this.authService.SignIn(dto).pipe(
          catchError((error) => {
            // Преобразуем gRPC ошибку в HTTP-ответ
            const grpcError = error as { code: number; details: string };

            if (grpcError.code === Status.NOT_FOUND) {
              throw new NotFoundException(grpcError.details);
            }
            if (grpcError.code === Status.UNAUTHENTICATED) {
              throw new UnauthorizedException(grpcError.details);
            }
            console.log('Api Controller', grpcError?.code);

            throw new InternalServerErrorException('test');
          }),
        ),
      );
    } catch (error) {
      // Логируем ошибку для отладки
      console.error('// Логируем ошибку для отладки', error);
      throw error;
    }
  }
}
