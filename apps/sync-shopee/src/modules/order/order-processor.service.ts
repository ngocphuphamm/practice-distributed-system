// // orders.processor.ts
// import { Process, Processor } from '@nestjs/bull';
// import { Job } from 'bull';
// import { OrderService } from './order.service';

// @Processor('orders')
// export class OrderProcessor {
//   constructor(private ordersService: OrderService) {}

//   @Process('syncOrders')
//   async handleOrderSync(job: Job) {
//     const { startDate, endDate } = job.data;

//     // Fetch and process orders in pages
//     let page = 1;
//     let hasMorePages = true;

//     while (hasMorePages) {
//       const orderIds = await this.ordersService.getOrderIds(startDate, endDate, page);
//       for (const orderId of orderIds) {
//         // Assuming getOrderDetails and saveOrder are methods in OrdersService
//         const orderDetails = await this.ordersService.getOrderDetails(orderId);
//         await this.ordersService.saveOrder(orderDetails);
//         job.progress(page); // Optional: update job progress
//       }

//       page++;
//       hasMorePages = await this.ordersService.checkForMorePages(page);
//     }

//     // Check for completion or schedule next job if needed
//     const currentDate = new Date();
//     if (endDate < currentDate) {
//       // Push next job to queue, calculate new dates accordingly
//       // ...
//     }

//     return { status: 'complete' };
//   }
// }
