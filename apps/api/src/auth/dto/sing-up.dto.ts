import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SignUpRequest, User } from 'shared/generated/auth';

class UserDto implements Omit<User, 'id' | 'roleId'> {
  @IsString({ message: 'Поле firstName должно быть типа STRING' })
  @IsNotEmpty({ message: 'Поле firstName не должно быть пустым' })
  firstName: string;

  @IsString({ message: 'Поле lastName должно быть типа STRING' })
  @IsNotEmpty({ message: 'Поле lastName не должно быть пустым' })
  lastName: string;

  @IsString({ message: 'Поле middleName должно быть типа STRING' })
  @IsOptional()
  middleName?: string | undefined;
}

export class SignUpDto implements SignUpRequest {
  @IsString({ message: 'Поле email должно быть типа STRING' })
  @IsEmail()
  @IsNotEmpty({ message: 'Поле email не должно быть пустым' })
  email: string;

  @IsString({ message: 'Поле password должно быть типа STRING' })
  @IsNotEmpty({ message: 'Поле password не должно быть пустым' })
  password: string;

  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmpty({ message: 'Поле name не должно быть пустым' })
  name: UserDto;

  @IsNumber({}, { message: 'Поле roleId должно быть типа NUMBER' })
  @IsOptional()
  roleId?: number;
}
