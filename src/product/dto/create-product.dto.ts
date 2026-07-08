import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 15 Pro Max', description: 'The name of the product' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Titanium Blue, 256GB storage', description: 'Detailed description of the product' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ example: 1299.99, description: 'Price of the product' })
  @IsNumber()
  @IsNotEmpty()
  price!: number;

  @ApiProperty({ example: 50, description: 'Available stock quantity' })
  @IsNumber()
  @IsNotEmpty()
  stock!: number;

  @ApiProperty({ example: 2, description: 'The ID of the category this product belongs to' })
  @IsNumber()
  @IsNotEmpty()
  categoryId!: number;
}