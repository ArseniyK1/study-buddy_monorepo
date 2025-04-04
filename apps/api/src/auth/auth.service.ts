// import { AuthResponse } from '../../../grpc/src/generated-types/auth';
import { SignInDto } from './dto/sing-in.dto';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface AuthServiceClient {
  FindAllUsers(request: object): Observable<{ users: any[] }>;
  SignIn(dto: SignInDto): Observable<any>;
}

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(@Inject('GRPC_SERVICE') private client: ClientGrpc) {}
  private authService: AuthServiceClient;

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>('AuthService');
    console.log('Service methods:', Object.keys(this.authService));
  }

  getUsers() {
    return this.authService.FindAllUsers({
      email: 'email',
      password: 'password',
    }); // Теперь метод существует!
  }

  signIn(dto: SignInDto): Observable<any> {
    return this.authService.SignIn(dto);
  }
}
