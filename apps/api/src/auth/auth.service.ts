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
      return await firstValueFrom(
        this.authService.SignIn(dto).pipe(
          catchError((error) => {
            console.log('AuthService error:', error);
            throw new RpcException({
              code: error.code || Status.INTERNAL,
              message: error.message || 'Internal server error',
            });
          }),
        ),
      );
    } catch (error) {
      console.log('AuthService catch error:', error);
      throw error;
    }
  }
}
