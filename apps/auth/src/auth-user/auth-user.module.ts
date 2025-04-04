import { Module } from '@nestjs/common';
import { AuthUserService } from './auth-user.service';
import { AuthUserController } from './auth-user.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [AuthUserController],
  providers: [AuthUserService, PrismaService],
})
export class AuthUserModule {}
