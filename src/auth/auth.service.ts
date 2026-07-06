import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UsersService } from 'src/user/user.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async register(body: RegisterDto) {
    const email = body.email;
    const existingUser = await this.usersService.findByEmail(email);
    
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await this.usersService.create(email, passwordHash);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async login(body: LoginDto) {
    const email = body.email;
    const existingUser = await this.usersService.findByEmail(email);

    if (!existingUser) {
      throw new UnauthorizedException('Wrong email or password');
    }

    const isMatch = await bcrypt.compare(body.password, existingUser.password);
    if (!isMatch) {
      throw new UnauthorizedException('Wrong email or password');
    }

    const payload = {
      sub: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  async forgotPassword(body: ForgotPasswordDto) {
    const email = body.email;
    const existingUser = await this.usersService.findByEmail(email)
    if (!existingUser) {
      throw new NotFoundException('User with this email does not exist.');
    }
    const token = crypto.randomBytes(32).toString('hex');
    const expirationDate = new Date(Date.now() + 900 * 1000);
    await this.usersService.updateResetToken(email, token, expirationDate);
    const resetLink = `http://localhost:3000/auth/reset-password?token=${token}`;

    await this.mailerService.sendMail({
    to: email,
    subject: 'Password Reset Request',
    html: `
    <p>You requested a password reset for your account.</p>
    <p>Please click the link below to reset your password. This link is valid for 15 minutes:</p>
    <p><a href="${resetLink}">Reset Password</a></p>
    <p>If you did not request this, please ignore this email.</p>
    `,
    });
    return {
    message: 'A password reset link has been sent to your email address. Please check your inbox and follow the instructions to reset your password.'
    };
}

  async resetPassword(body: ResetPasswordDto) {
    const user = await this.usersService.findByResetToken(body.token);
    if (!user) {
      throw new BadRequestException('Invalid or expired reset token.');
    }
    if (user.resetTokenExpires && user.resetTokenExpires < new Date()) {
      throw new BadRequestException('Reset token has expired.');
    }
    const passwordHash = await bcrypt.hash(body.newPassword, 10);
    await this.usersService.updatePasswordAndClearToken(user.email, passwordHash);
    return {
    message: 'Your password has been successfully reset. You can now log in with your new password.'
  };
  }
}