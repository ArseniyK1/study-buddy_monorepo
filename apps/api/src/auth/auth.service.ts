import { SignInDto } from './dto/sing-in.dto';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  AuthResponse,
  UserListResponse,
  FindAllUsersRequest,
} from 'shared/generated/auth';
import { SignUpDto } from './dto/sing-up.dto';
import { handleRequest } from '../grpc/grpc.handle';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheResponse } from '../decorators/cache.decorator';

interface AuthServiceClient {
  FindAllUsers(dto: FindAllUsersRequest): Observable<UserListResponse>;
  SignIn(dto: SignInDto): Observable<AuthResponse>;
  SignUp(dto: SignUpDto): Observable<AuthResponse>;
  GetProfile(id: number): any;
}

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject('GRPC_SERVICE') private client: ClientGrpc,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
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

  @CacheResponse(600)
  async findAllUsers(dto: FindAllUsersRequest): Promise<UserListResponse> {
    return await handleRequest(() => this.authService.FindAllUsers(dto));
  }

  async getProfile(id: number) {
    console.log(id);

    return await handleRequest(() => this.authService.GetProfile(id));
  }
}
