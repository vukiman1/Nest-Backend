import { IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDto {
  e: string;

  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsNotEmpty()
  passWord: string;
}
