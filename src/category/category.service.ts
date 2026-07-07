import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService) {}
    async createCategory(dto: CreateCategoryDto) {
        try{
            return await this.prisma.category.create({
            data: {
                name: dto.name,
                slug: dto.slug,
                parentId: dto.parentId
            }
        })
        }
        catch(error: any){
            if (error.code === 'P2002') {
                throw new Error('Category with this name or slug already exists.');
            }
            throw error;
        }
    }
    async getCategoriesTree() {
        return await this.prisma.category.findMany({
            where: {
                parentId: null
            },
            include:{
                children: {
                    include: {
                        children: true
                    }
            }
            }
        })
}
}
