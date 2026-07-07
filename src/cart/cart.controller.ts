import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';

@UseGuards(JwtAuthGuard, RolesGuard) 
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}
    @Post('add')
    async addToCart(@GetUser('id') userId: number, @Body() dto: AddToCartDto) {
        return this.cartService.addToCart(userId, dto);
}
    @Get()
    async getCart(@GetUser('id') userId: number) {
        return this.cartService.getCart(userId);
    }
    @Post('remove')
    async removeFromCart(@GetUser('id') userId: number, @Body() dto: RemoveFromCartDto) {
        return this.cartService.removeFromCart(userId, dto);
} 

}
