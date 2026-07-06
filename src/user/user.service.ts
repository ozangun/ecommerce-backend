import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(email: string, passwordHash: string) {
    return this.prisma.user.create({
      data: { email, password: passwordHash },
    });
  }

  async updateResetToken(email: string, token: string, expirationDate: Date) {
    return this.prisma.user.update({
      where: { email },
      data: { resetToken: token, resetTokenExpires: expirationDate },
    });
  }

  async findByResetToken(token: string){
    return this.prisma.user.findFirst({where: {resetToken: token}})
  }

  async updatePasswordAndClearToken(email: string, passwordHash: string) {
    return this.prisma.user.update({
      where: { email },
      data: { password: passwordHash, resetToken: null, resetTokenExpires: null },
    });
  }
}
