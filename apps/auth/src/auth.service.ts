import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { PrismaService } from './prisma.service';
import { AuthResponse, SignInRequest } from 'shared/generated/auth';
import { RpcException } from '@nestjs/microservices';
import { Status } from '@grpc/grpc-js/build/src/constants';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(dto: SignInRequest): Promise<AuthResponse> {
    const user = await this.prisma.auth_user.findUnique({
      where: { email: dto.email },
    });

    if (!user?.id) {
      console.log('Auth Controller', Status.NOT_FOUND);
      throw new RpcException({
        code: Status.NOT_FOUND,
        message: 'Такого пользователя не существует!',
      });
      // throw new NotFoundException('Такого пользователя не существует!');
    }
    const areEqual = await compare(
      dto.password.toString(),
      user.password.toString(),
    );
    if (!areEqual) {
      throw new RpcException({
        code: Status.NOT_FOUND,
        message: 'Такого пользователя не существует!',
      });
    }
    const role = await this.prisma.role.findUnique({
      where: { id: +user.role_id },
    });
    const payload = {
      userId: user.id,
      username: user.email,
      role: role?.value,
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async getProfile(req: any) {
    const user = await this.prisma.auth_user.findUnique({
      where: { id: req.user.userId },
    });
    return user;
  }
}
