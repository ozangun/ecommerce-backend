import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
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
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
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
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: 'localhost',
            port: 6379,
          },
          ttl: 300000,
        }),
      }),
    }),
    MailModule, 
    PrismaModule, 
    AuthModule, 
    UserModule, 
    CategoryModule, 
    ProductModule, 
    CartModule, 
    OrderModule, SearchModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD, 
      useClass: ThrottlerGuard
    },
    AppService
  ],
})
export class AppModule {}