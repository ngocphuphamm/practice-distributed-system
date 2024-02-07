// order-list.processor.ts
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import axios from 'axios'; // Import Axios library for making HTTP requests
import { Job, Queue } from 'bull';
import { SyncService } from '../sync.service';

@Processor('order-list')
export class OrderListProcessor {
  constructor(@InjectQueue('order-detail') private orderDetailQueue: Queue,
  @InjectQueue('order-list') private orderListQueue: Queue,
  @Inject('SYNC-SERVICE') private syncService: SyncService
  ) {}
  @Process()
  async handleOrderList(job: Job) {
    console.log('========== VAO ORDER LIST =================================');
    // Logic to handle fetching the list of orders
    // This could be a call to an external API or a database query
    const { jobId, startDate, endDate, page } = job.data;

    const syncJobId = jobId || (await this.syncService.createSyncJob()).id;
    await this.syncService.incrementJobsCreated(syncJobId);

    const orderData = await this.fetchOrderList(startDate, endDate, page);
    const listId = orderData.orders.map((order) => order.orderId);
    await this.syncService.incrementJobsCreated(syncJobId, listId.length)

    const maxConcurrency = 5;

    // Split the list of IDs into smaller chunks to limit concurrency
    const idChunks = this.chunkArray(listId, maxConcurrency);

    Promise.all([
      idChunks.map(async (chunk) => {
        const promises = chunk.map((orderId: number) =>
          this.addToOrderDetailQueue(orderId, syncJobId)
        );
        await Promise.all(promises);
      }),
      this.addOrderListPage(orderData, startDate, endDate, page, syncJobId)
    ])

    await this.syncService.incrementJobsCompleted(syncJobId);

    return orderData;
  }

  private addOrderListPage(orderData: any, startDate: string, endDate: string, page: number, jobId?: number) {
    const nextStartDate = new Date(endDate);
    nextStartDate.setDate(nextStartDate.getDate() + 1);
    const nextEndDate = new Date(nextStartDate);
    nextEndDate.setDate(nextEndDate.getDate() + 15);

    if (orderData.has_more) {
      // If there are more pages, add the next page job
      this.orderListQueue.add({
        jobId,
        startDate,
        endDate,
        page: page + 1,
      });
    } else if (nextStartDate <= new Date()) {
      // If the next start date is not beyond today, add the next date range job
      // Convert dates back to strings if necessary
      const nextStartStr = nextStartDate.toISOString().split('T')[0];
      const nextEndStr = nextEndDate.toISOString().split('T')[0];

      this.orderListQueue.add({
        jobId,
        startDate: nextStartStr,
        endDate: nextEndStr,
        page: 1,
      });
    }
    // If nextStartDate is beyond today, do not enqueue more jobs
  }

  private async fetchOrderList(
    startDate: string,
    endDate: string,
    page: number
  ): Promise<{
    orders: any;
    has_more: boolean;
  }> {
    try {
      // Replace the URL with the actual API endpoint you want to fetch data from
      const apiUrl = `http://localhost:3002/orders?startDate=${startDate}&endDate=${endDate}&page=${page}`;

      // Make a GET request using Axios
      const response = await axios.get(apiUrl, {
        // You can also set headers, authentication tokens, etc. if required
        // headers: {
        //   'Authorization': 'Bearer yourAccessToken',
        // },
      });

      // Extract the data from the response
      const orderList = response.data;

      return orderList;
    } catch (error) {
      // Handle errors here
      console.error('Error fetching order list:', error);
      throw error;
    }
  }

  private async addToOrderDetailQueue(orderId: number, syncJobId: number): Promise<void> {
    // Add order to the queue, replace this with your actual queue logic
    try {
      await this.orderDetailQueue.add({
        orderId,
        syncJobId
      });
    } catch (error) {
      // Handle errors here
      console.error(`Error adding order ${orderId} to the queue:`, error);
      throw error;
    }
  }

  private chunkArray(array: any[], chunkSize: number): any[][] {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunkedArray.push(array.slice(i, i + chunkSize));
    }
    return chunkedArray;
  }
}
