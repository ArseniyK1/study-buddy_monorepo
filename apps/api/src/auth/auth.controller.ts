import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sing-in.dto';
import {
  AuthResponse,
  FindAllUsersRequest,
  UserListResponse,
} from 'shared/generated/auth';
import { Public } from './guard/public.decorator';
import { SignUpDto } from './dto/sing-up.dto';
import { CacheResponse } from '../decorators/cache.decorator';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Public()
  @Post('/signIn')
  signIn(@Body() dto: SignInDto): Promise<AuthResponse> {
    return this.authService.signIn(dto);
  }

  @Public()
  @Post('/signUp')
  signUp(@Body() dto: SignUpDto): Promise<AuthResponse> {
    return this.authService.signUp(dto);
  }

  @CacheResponse(600)
  @Post('/all-users')
  findAllUsers(@Body() dto: FindAllUsersRequest): Promise<UserListResponse> {
    return this.authService.findAllUsers(dto);
  }
}
