import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: number, dto: CreateOrderDto) {
    const extractedUserId = typeof userId === 'object' ? (userId as any).userId : userId;
    const cart = await this.prisma.cart.findUnique({
    where:{ userId: extractedUserId},
       include: {
        items: {
            include: {
                product: true 
                    }
                }
} 
  });
  if (!cart || cart.items.length === 0){
    throw new NotFoundException({message:"Cart is not found"})

  }
    let totalPrice = 0;
    for (const item of cart.items) {
        if (item.quantity > item.product.stock) {
            throw new BadRequestException({message:"Not enough stock"})
        }
  totalPrice += item.product.price * item.quantity;
}
    if (dto.cardNumber === '0000') {
        throw new BadRequestException({ message: "Payment failed: Insufficient funds" });
    }

const order = await this.prisma.$transaction(async (tx) => {
      
      const newOrder = await tx.order.create({
        data: {
          userId: extractedUserId,
          totalPrice: totalPrice,
          status: OrderStatus.PAID, 
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
      });

      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity }
          }
        });
      }

      await tx.cartItem.deleteMany({
        where: {cartId: cart.id}
      });

      return newOrder;
    });

    return { message: "Order placed successfully", order };
  }
}