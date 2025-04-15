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

class UserNameDto
  implements Omit<User, 'id' | 'role_id' | 'email' | 'password'>
{
  @IsString({ message: 'Поле first_name должно быть типа STRING' })
  @IsNotEmpty({ message: 'Поле first_name не должно быть пустым' })
  first_name: string;

  @IsString({ message: 'Поле second_name должно быть типа STRING' })
  @IsNotEmpty({ message: 'Поле second_name не должно быть пустым' })
  second_name: string;

  @IsString({ message: 'Поле middle_name должно быть типа STRING' })
  @IsNotEmpty({ message: 'Поле second_name не должно быть пустым' })
  middle_name: string;
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
  @Type(() => UserNameDto)
  @IsNotEmpty({ message: 'Поле name не должно быть пустым' })
  name: UserNameDto;

  @IsNumber({}, { message: 'Поле roleId должно быть типа NUMBER' })
  @IsOptional()
  role_id?: number;
}
