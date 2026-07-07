import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 
import { RolesGuard } from '../auth/roles.guard'; 
import { Roles } from '../auth/roles.decorator'; 
import { Role } from '@prisma/client';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @UseGuards(JwtAuthGuard, RolesGuard) 
    @Roles(Role.ADMIN)
    @Post('create')
    async createCategory(@Body() body: CreateCategoryDto) {
        return this.categoryService.createCategory(body);
    }

    @Get('list')
    async getCategories() {
        return this.categoryService.getCategoriesTree();
    }
}