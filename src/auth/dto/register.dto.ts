import { IsEmail, IsNotEmpty, Length} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  @IsNotEmpty({ message: 'Email field cannot be empty.' })
  email!: string;

  @IsNotEmpty({ message: 'Password field cannot be empty.' })
  @Length(8, 64, { message: 'Password must be between 8 and 64 characters long.' })
  password!: string;
}