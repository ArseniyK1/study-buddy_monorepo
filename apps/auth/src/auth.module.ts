import { Module } from '@nestjs/common';
import { AuthUserModule } from './auth-user/auth-user.module';

@Module({
  imports: [AuthUserModule],
})
export class AuthModule {}
