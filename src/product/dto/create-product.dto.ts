import { IsInt, IsNotEmpty, IsNumber, IsString, Min} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Product name field cannot be empty.' })
  @IsString({ message: 'Product name must be a string.' })
  name!: string;

  @IsNotEmpty({ message: 'Product description field cannot be empty.' })
  @IsString({ message: 'Product description must be a string.' })
  description!: string;

  @IsNotEmpty({ message: 'Product price field cannot be empty.' })
  @Min(0)
  @IsNumber()
  price!: number;

  @IsNotEmpty({ message: 'Product stock field cannot be empty.' })
  @Min(0)
  @IsInt({ message: 'Stock number must be an integer.' })
  stock!: number;
  
  @IsNotEmpty({ message: 'Category ID field cannot be empty.' })
  @IsInt({ message: 'Category ID must be an integer.' })
  categoryId!: number;
}