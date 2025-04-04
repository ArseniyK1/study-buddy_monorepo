import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsString({ message: 'Поле email должно быть типа STRING' })
  @IsEmail()
  @IsNotEmpty({ message: 'Поле email не должно быть пустым' })
  email: string;

  @IsString({ message: 'Поле password должно быть типа STRING' })
  @IsNotEmpty({ message: 'Поле password не должно быть пустым' })
  password: string;
}
