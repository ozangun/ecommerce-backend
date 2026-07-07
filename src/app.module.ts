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
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { CartController } from './cart/cart.controller';
import { CartService } from './cart/cart.service';
import { CartModule } from './cart/cart.module';

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
    ]),ConfigModule.forRoot({isGlobal: true}), MailModule, PrismaModule, AuthModule, UserModule, CategoryModule, ProductModule, CartModule],
  controllers: [AppController, CartController],
  providers: [{provide: APP_GUARD, useClass: ThrottlerGuard},AppService, CartService],
})
export class AppModule {}