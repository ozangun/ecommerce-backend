import { IsEmail, IsNotEmpty, Length} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(8,64)
  password: string;
}