import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import axios from 'axios'; // Import Axios library for making HTTP requests
import { Job, Queue } from 'bull';
import { Transactional } from 'typeorm-transactional';
import { SyncService } from '../sync.service';

@Processor('order-detail')
export class OrderDetailProcessor {
  constructor(
    @InjectQueue('order-list') private orderListQueue: Queue,
    @Inject('SYNC-SERVICE') private syncService: SyncService

  ) {}

  @Process()
  @Transactional()
  async handleOrderDetail(job: Job) {

    const { syncJobId, orderId } = job.data;
    console.log(`========== VAO ORDER DETAIL ${orderId} =================================`);

    const orderDetails = await this.fetchOrderDetails(orderId);
    this.syncService.incrementJobsCompleted(syncJobId)
    return orderDetails;
  }

  private async fetchOrderDetails(orderId: string): Promise<any> {
    try {
      // Replace with the actual URL to fetch order details
      const apiUrl = `http://localhost:3002/orders/${orderId}`;

      // Make a GET request using Axios
      const response = await axios.get(apiUrl);

      // Extract the order details data from the response
      const orderDetails = response.data;

      return orderDetails;
    } catch (error) {
      // Handle errors here
      console.error(`Error fetching order details for orderId ${orderId}:`, error);
      throw error;
    }
  }
}
