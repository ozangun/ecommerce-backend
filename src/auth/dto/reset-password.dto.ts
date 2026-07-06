import { IsNotEmpty, Length } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Reset token cannot be empty.' })
  token!: string;
  @Length(8, 64, { message: 'New password must be between 8 and 64 characters long.' })
  newPassword!: string;
}