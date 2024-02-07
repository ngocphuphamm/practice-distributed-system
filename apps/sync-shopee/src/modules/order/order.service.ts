// orders.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import axios from 'axios';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SyncService } from './sync.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectQueue('order-list') private orderListQueue: Queue,
    @Inject('SYNC-SERVICE') private syncService: SyncService
  ) {}

  async enqueueOrderListJob() {
    // Calculate dates
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 15); // X+15 days

    // Example : 6 Feb 2024
    // GET DATA FROM 6 FEB 2023 - 21 FEV 2023
    // Format dates as strings if necessary, e.g., 'YYYY-MM-DD'
    const start = startDate.toISOString().split('T')[0]; // 2024-02-06
    const end = endDate.toISOString().split('T')[0]; //  2024-02-21

    // // Add job with date range data
    await this.orderListQueue.add({
      startDate: start,
      endDate: end,
      page: 1
    });

  }


}
