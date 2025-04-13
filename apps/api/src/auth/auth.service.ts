import { FindAllUsersRequest } from './../../../../shared/generated/auth';
import { SignInDto } from './dto/sing-in.dto';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AuthResponse, UserListResponse } from 'shared/generated/auth';
import { SignUpDto } from './dto/sing-up.dto';
import { handleRequest } from '../grpc/grpc.handle';

interface AuthServiceClient {
  FindAllUsers(dto: FindAllUsersRequest): Observable<UserListResponse>;
  SignIn(dto: SignInDto): Observable<AuthResponse>;
  SignUp(dto: SignUpDto): Observable<AuthResponse>;
}

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(@Inject('GRPC_SERVICE') private client: ClientGrpc) {}
  private authService: AuthServiceClient;

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>('AuthService');
  }

  async signIn(dto: SignInDto): Promise<AuthResponse> {
    return await handleRequest(() => this.authService.SignIn(dto));
  }

  async signUp(dto: SignUpDto): Promise<AuthResponse> {
    return handleRequest(() => this.authService.SignUp(dto));
  }

  async findAllUsers(dto: FindAllUsersRequest): Promise<UserListResponse> {
    return await handleRequest(() => this.authService.FindAllUsers(dto));
  }
}
