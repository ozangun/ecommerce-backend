import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard) 
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @ApiOperation({ summary: 'Add an item or update its quantity in the cart' })
  @ApiResponse({ status: 201, description: 'Item added to cart successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input or requested quantity exceeds available stock.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Missing or invalid JWT token.' })
  async addToCart(@GetUser('id') userId: number, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve the current user shopping cart' })
  @ApiResponse({ status: 200, description: 'Returns the cart details along with list of items.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Missing or invalid JWT token.' })
  async getCart(@GetUser('id') userId: number) {
    return this.cartService.getCart(userId);
  }

  @Post('remove')
  @ApiOperation({ summary: 'Remove an item or decrease its quantity from the cart' })
  @ApiResponse({ status: 200, description: 'Item successfully updated or removed from cart.' })
  @ApiResponse({ status: 400, description: 'Item not found in cart.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Missing or invalid JWT token.' })
  async removeFromCart(@GetUser('id') userId: number, @Body() dto: RemoveFromCartDto) {
    return this.cartService.removeFromCart(userId, dto);
  }
}