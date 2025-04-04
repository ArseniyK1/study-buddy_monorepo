import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthUserService } from './auth-user.service';
import { CreateAuthUserDto } from './dto/create-auth-user.dto';
import { UpdateAuthUserDto } from './dto/update-auth-user.dto';

@Controller()
export class AuthUserController {
  constructor(private readonly authUserService: AuthUserService) {}

  @MessagePattern('findAllAuthUser')
  findAll(data: { name: string }) {
    return this.authUserService.findAll(data);
  }

  @MessagePattern('updateAuthUser')
  update(@Payload() updateAuthUserDto: UpdateAuthUserDto) {
    return this.authUserService.update(updateAuthUserDto.id, updateAuthUserDto);
  }

  @MessagePattern('removeAuthUser')
  remove(@Payload() id: number) {
    return this.authUserService.remove(id);
  }
}
