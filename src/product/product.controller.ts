import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('product')
export class ProductController {
constructor(private readonly productService: ProductService) {}

    @UseGuards(JwtAuthGuard, RolesGuard) 
    @Roles(Role.ADMIN)
    @Post('create')
    async createProduct(@Body() body: CreateProductDto) {
        return this.productService.createProduct(body);
    }

    @Get('list')
    async getAllProducts() {
        return this.productService.getAllProducts();
    }

}
