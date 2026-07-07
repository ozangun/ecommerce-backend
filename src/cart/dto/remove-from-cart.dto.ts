import { IsInt , IsNotEmpty , Min } from 'class-validator';
export class RemoveFromCartDto {
  @IsNotEmpty({message: 'Product ID is required'})
  @IsInt({message: 'Product ID must be an integer'})
  productId!: number;

  @IsNotEmpty({message: 'Quantity is required'})
  @IsInt({message: 'Quantity must be an integer'})
  @Min(1)
  quantity!: number;
}