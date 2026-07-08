import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SearchModule } from '../search/search.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [PrismaModule,SearchModule],
})
export class ProductModule {}
