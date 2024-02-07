// orders.controller.ts
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { Queue } from 'bull';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private ordersService: OrderService) {}

  @Get('/enqueue-order-list')
    async enqueueOrderListJob() {
      await this.ordersService.enqueueOrderListJob();
      return { message: 'Order list job enqueued successfully' };
    }
  // @Post('sync')
  // async triggerSync(@Body() syncParams: any) {
  //   const job = await this.ordersQueue.add('syncOrders', {
  //     startDate: syncParams.startDate,
  //     endDate: syncParams.endDate,
  //   });

  //   return { jobId: job.id };
  // }
}
