import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcrypt';
import { PrismaService } from './prisma.service';
import {
  AuthResponse,
  FindAllUsersRequest,
  GetProfileRequest,
  SignInRequest,
  SignUpRequest,
  User,
  UserListResponse,
} from 'shared/generated/auth';
import { RpcException } from '@nestjs/microservices';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { getAllUsers } from '@prisma/client/sql';

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
        code: Status.NOT_FOUND,
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
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async findOne(email: string) {
    const user = await this.prisma.auth_user.findUnique({
      where: { email },
    });

    return !!user?.id ? user : null;
  }

  async getProfile(data: GetProfileRequest): Promise<User | null> {
    const user = await this.prisma.auth_user.findUnique({
      where: { id: data.user_id },
    });
    return !!user?.id ? { ...user, middle_name: user.middle_name ?? '' } : null;
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
        first_name: dto.name?.first_name || '',
        second_name: dto.name?.second_name || '',
        middle_name: dto.name?.middle_name || '',
        role_id: 1,
      },
    });

    const payload = {
      userId: newUser.id,
      username: newUser.email,
      role: newUser.role_id,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async findAllUsers(dto: FindAllUsersRequest) {
    const users: getAllUsers.Result[] = await this.prisma.$queryRawTyped(
      getAllUsers(dto.name_filter || '', 0, 100),
    );

    return users;
  }
}
