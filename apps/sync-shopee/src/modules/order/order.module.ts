// orders.module.ts
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Order } from './entities/order.entity';
import { SyncJob } from './entities/sync-jobs.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderDetailProcessor } from './processor/order-detail.processor';
import { OrderListProcessor } from './processor/order-list.processor';
import { SyncService } from './sync.service';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'order-list',
      },
      {
        name: 'order-detail',
      },
    ),
    TypeOrmModule.forFeature([Order, SyncJob, Job]),

  ],
  controllers: [OrderController],
  providers: [OrderService, OrderListProcessor, OrderDetailProcessor,
  {
    provide: 'SYNC-SERVICE',
    useClass: SyncService
  }],
})
export class OrderModule {}
