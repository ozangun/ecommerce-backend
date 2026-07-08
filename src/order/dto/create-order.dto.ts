import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'The full name of the cardholder as it appears on the card',
    example: 'Ozan Gün',
  })
  @IsString()
  @IsNotEmpty()
  cardHolderName!: string;

  @ApiProperty({
    description: 'The 16-digit credit card number',
    example: '4355123456789012',
  })
  @IsString()
  @IsNotEmpty()
  cardNumber!: string;

  @ApiProperty({
    description: 'The expiration date of the card in MM/YY format',
    example: '12/29',
  })
  @IsString()
  @IsNotEmpty()
  expireDate!: string;

  @ApiProperty({
    description: 'The 3-digit card verification value (CVV) code',
    example: '321',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  cvv!: string;
}