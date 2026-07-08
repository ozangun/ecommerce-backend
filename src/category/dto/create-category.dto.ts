import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics', description: 'The name of the category' })
  @IsNotEmpty({ message: 'Category name field cannot be empty.' })
  @IsString({ message: 'Category name must be a string.' })
  name!: string;

  @ApiProperty({ 
    example: 'electronics', 
    description: 'The SEO-friendly URL slug generated from the category name. Must be unique and URL-safe.',
    format: 'slug'
  })
  @IsNotEmpty({ message: 'Category slug field cannot be empty.' })
  @IsString({ message: 'Category slug must be a string.' })
  slug!: string;

  @ApiProperty({ example: 1, description: 'Parent category ID if this is a sub-category', required: false })
  @IsOptional()
  @IsInt({ message: 'Parent ID must be an integer.' })
  parentId?: number;
  
}