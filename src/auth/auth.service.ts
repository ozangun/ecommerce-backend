import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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
}