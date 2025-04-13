import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcrypt';
import { PrismaService } from './prisma.service';
import {
  AuthResponse,
  FindAllUsersRequest,
  SignInRequest,
  SignUpRequest,
  UserListResponse,
} from 'shared/generated/auth';
import { RpcException } from '@nestjs/microservices';
import { Status } from '@grpc/grpc-js/build/src/constants';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(dto: SignInRequest): Promise<AuthResponse> {
    const user = await this.findOne(dto.email);
    if (!user) {
      throw new RpcException({
        code: Status.UNAUTHENTICATED,
        message: 'Пользователь не найден!',
      });
    }
    const areEqual = await compare(
      dto.password.toString(),
      user.password.toString(),
    );
    if (!areEqual) {
      throw new RpcException({
        code: Status.UNAUTHENTICATED,
        message: 'Неправильный пароль!',
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

  async findOne(email: string, errorMessage?: string) {
    const user = await this.prisma.auth_user.findUnique({
      where: { email },
    });

    return !!user?.id ? user : null;
  }

  async getProfile(req: any) {
    const user = await this.prisma.auth_user.findUnique({
      where: { id: req.user.userId },
    });
    return user;
  }

  async signUp(dto: SignUpRequest): Promise<AuthResponse> {
    const user = await this.findOne(dto.email);
    if (!!user?.id) {
      throw new RpcException({
        code: Status.ALREADY_EXISTS,
        message: 'Пользователь с таким email уже существует!',
      });
    }
    const salt = await genSalt(10);
    const hashPassword = await hash(dto.password, salt); // bycrypt создаёт хеш пароля
    const newUser = await this.prisma.auth_user.create({
      data: {
        email: dto.email,
        password: hashPassword,
        first_name: dto.name?.firstName,
        second_name: dto.name?.lastName,
        middle_name: dto.name?.middleName,
        role_id: 1,
      },
    });

    const payload = {
      userId: newUser.id,
      username: newUser.email,
      role: newUser.role_id,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async findAllUsers(dto: FindAllUsersRequest): Promise<UserListResponse> {
    const users = await this.prisma.auth_user.findMany({
      where: {
        OR: [
          {
            first_name: {
              contains: dto.nameFilter,
              mode: 'insensitive',
            },
          },
          {
            second_name: {
              contains: dto.nameFilter,
            },
          },
          {
            middle_name: {
              contains: dto.nameFilter,
            },
          },
        ],
      },
    });

    return {
      users: users.map((user) => ({
        id: user.id,
        firstName: user.first_name || '',
        lastName: user.second_name || '',
        middleName: user.middle_name || undefined,
        roleId: user.role_id,
      })),
    };
  }
}
