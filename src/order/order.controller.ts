import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('order')
@UseGuards(JwtAuthGuard)
export class OrderController {
    constructor(private readonly orderService: OrderService) {}
    @Post('create')
    @ApiOperation({ summary: 'Create a new order from current user cart' })
    @ApiResponse({ status: 201, description: 'Order successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad request due to insufficient stock, payment failure, or invalid inputs.' })
    @ApiResponse({ status: 401, description: 'Unauthorized. Invalid or missing JWT token.' })
    async createOrder(@GetUser() user: any,@Body() body: CreateOrderDto) {
            return this.orderService.createOrder(user.userId, body);
        }
}
