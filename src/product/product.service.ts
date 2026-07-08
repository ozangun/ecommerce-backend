import { Injectable, Inject, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { SearchService } from 'src/search/search.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly searchService: SearchService,
  ) {}

  async createProduct(dto: CreateProductDto) {
    try {
      const product = await this.prisma.product.create({
        data: {
          name: dto.name,
          description: dto.description,
          price: dto.price,
          stock: dto.stock,
          categoryId: dto.categoryId
        }
      });

      
      await this.cacheManager.del('all_products');
      await this.searchService.indexProduct(product);

      return product;
    } catch (error: any) {
      if (error.code === 'P2003') {
        throw new NotFoundException(`Category with ID ${dto.categoryId} does not exist.`);
      }
      throw new InternalServerErrorException('Something went wrong while creating the product.');
    }
  }

  async getAllProducts() {
    const cacheKey = 'all_products';

    
    const cachedProducts = await this.cacheManager.get(cacheKey);
    if (cachedProducts) {
      return cachedProducts;
    }

    
    const products = await this.prisma.product.findMany({
      include: {
        category: true
      }
    });

    
    await this.cacheManager.set(cacheKey, products, 300000);

    return products;
    
  }
    async searchProducts(query: string) {
    return this.searchService.searchProducts(query);
  }
}