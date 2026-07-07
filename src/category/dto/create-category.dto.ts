import { IsInt, IsNotEmpty, IsOptional, IsString} from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Category name field cannot be empty.' })
  @IsString({ message: 'Category name must be a string.' })
  name!: string;

  @IsNotEmpty({ message: 'Category slug field cannot be empty.' })
  @IsString({ message: 'Category slug must be a string.' })
  slug!: string;

  @IsOptional()
  @IsInt({ message: 'Parent ID must be an integer.' })
  parentId?: number;
  
}