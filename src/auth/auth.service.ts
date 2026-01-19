import { ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) {}
    async register(body: RegisterDto) {
        const email = body.email;
        const existingUser = await this.prisma.user.findUnique({where: { email },});
        if(existingUser){
            throw new ConflictException('Email already registered');
        }
        const passwordHash = await bcrypt.hash(body.password, 10);
        const user = await this.prisma.user.create({
            data:{
                email:email,
                password:passwordHash
            }
        });
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        };
}
    async login(body: LoginDto){
        const email = body.email;
        const existingUser = await this.prisma.user.findUnique({where: { email },});
        if(!existingUser){
            throw new UnauthorizedException('Wrong email or password');

        }
        const password = body.password;
        const isMatch = await bcrypt.compare(password,existingUser.password)
        if(!isMatch){
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

