import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, 
        limit: 3, 
      },
      {
        name: 'medium',
        ttl: 60000,
        limit: 20,
      },
    ]),ConfigModule.forRoot({isGlobal: true}), MailModule, PrismaModule, AuthModule, UserModule],
  controllers: [AppController],
  providers: [{provide: APP_GUARD, useClass: ThrottlerGuard},AppService],
})
export class AppModule {}