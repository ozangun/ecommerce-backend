import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
 constructor(private readonly prisma: PrismaService) {}
 

    async createProduct(dto: CreateProductDto){
    try{
        return await this.prisma.product.create({
            data: {
                name: dto.name,
                description: dto.description,
                price: dto.price,
                stock: dto.stock,
                categoryId: dto.categoryId
            }
        })
        }
    catch(error: any){
    if (error.code === 'P2003') {
                throw new NotFoundException(`Category with ID ${dto.categoryId} does not exist.`);
    }
    throw new InternalServerErrorException('Something went wrong while creating the product.');
}
}
    async getAllProducts() {
        return await this.prisma.product.findMany({
            include: {
                category: true
            }
        });
    }
}
