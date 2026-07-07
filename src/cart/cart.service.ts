import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';

@Injectable()
export class CartService {
    constructor(private readonly prisma: PrismaService) {}
    async addToCart(userId: number, dto: AddToCartDto) {
        const product = await this.prisma.product.findUnique({
            where: {
                id: dto.productId,
            }
        })
        if (!product) {
            throw new NotFoundException(`Product with ID ${dto.productId} does not exist.`);    
        }
        if(product.stock < dto.quantity){
            throw new BadRequestException(`Not enough stock. Available stock: ${product.stock}`);
        }
        const extractedUserId = typeof userId === 'object' ? (userId as any).userId : userId;

        let cart = await this.prisma.cart.findUnique({
            where: { 
                userId: extractedUserId 
            }
        });
        if (!cart) {
            cart = await this.prisma.cart.create({
                data: { userId: extractedUserId }
            });
        }
        const existingCartItem = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: dto.productId
                }
            }
        })
        if (existingCartItem) {
            const totalQuantity = existingCartItem.quantity + dto.quantity;

            if (product.stock < totalQuantity) {
                throw new BadRequestException(`Cannot add more. Total in cart will exceed stock.`);
            }

            return await this.prisma.cartItem.update({
                where: { id: existingCartItem.id },
                data: { quantity: totalQuantity }
            });
        } else {
            return await this.prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: product.id,
                    quantity: dto.quantity
                }
            });
    }
    }
    async getCart(userId: number) {
    const extractedUserId = typeof userId === 'object' ? (userId as any).userId : userId;

    const cart = await this.prisma.cart.findUnique({
        where: {
            userId: extractedUserId
        },
        include: {
            items: {
                include: { product: true }
            }
        }
    });

    if (!cart) {
        return { userId: extractedUserId, items: [] };
    }

    return cart;
    }
    async removeFromCart(userId: number, dto: RemoveFromCartDto){
        const extractedUserId = typeof userId === 'object' ? (userId as any).userId : userId;
        const cart = await this.prisma.cart.findUnique({
        where: { userId: extractedUserId },
        include: { items: true } 
    });
    if (!cart) {
        throw new NotFoundException('Cart not found for this user.');
    }
    const targetItem = cart.items.find(item => item.productId === dto.productId);
    if (!targetItem) {
        throw new NotFoundException('This product is not in your cart.');
    }
    const updatedQuantity = targetItem.quantity - dto.quantity;
    if (updatedQuantity > 0) {
        return await this.prisma.cartItem.update({
            where: { id: targetItem.id },
            data: { quantity: updatedQuantity }
        });
    } else {
        return await this.prisma.cartItem.delete({
            where: { id: targetItem.id }
        });
    }
}
}