import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 
import { RolesGuard } from '../auth/roles.guard'; 
import { Roles } from '../auth/roles.decorator'; 
import { Role } from '@prisma/client';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(Role.ADMIN)
  @Post('create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product category (Admin Only)' })
  @ApiResponse({ status: 201, description: 'Category successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid category data provided or category already exists.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Missing or invalid JWT token.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have ADMIN privileges.' })
  async createCategory(@Body() body: CreateCategoryDto) {
    return this.categoryService.createCategory(body);
  }

  @Get('list')
  @ApiOperation({ summary: 'Retrieve the complete category tree structure' })
  @ApiResponse({ status: 200, description: 'Returns a hierarchical tree structure of all categories.' })
  async getCategories() {
    return this.categoryService.getCategoriesTree();
  }
}