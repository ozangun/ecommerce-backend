import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'; // Query import ettik
import { ProductService } from './product.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'; // ApiQuery ekledik

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(Role.ADMIN)
  @Post('create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product (Admin Only)' })
  @ApiResponse({ status: 201, description: 'Product successfully created.' })
  async createProduct(@Body() body: CreateProductDto) {
    return this.productService.createProduct(body);
  }

  @Get('list')
  @ApiOperation({ summary: 'Retrieve all available products' })
  @ApiResponse({ status: 200, description: 'Returns a complete list of products.' })
  async getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Get('search')
  @ApiOperation({ summary: 'Smart search products using Elasticsearch' })
  @ApiQuery({ name: 'q', description: 'Search query keyword (supports typos, e.g., "iphne")', required: true })
  @ApiResponse({ status: 200, description: 'Returns matching products from Elasticsearch.' })
  async searchProducts(@Query('q') query: string) {
    return this.productService.searchProducts(query);
  }
}