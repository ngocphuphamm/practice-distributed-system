// app.module.ts hoặc một module cụ thể khác
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from '../order/order.module';
import { Order } from '../order/entities/order.entity';
import { SyncJob } from '../order/entities/sync-jobs.entity';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { Job } from '../order/entities/job.entity';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue(
      {
        name: 'order-list',
      },
      {
        name: 'order-detail',
      },
    ),
    TypeOrmModule.forRootAsync({
      useFactory(){
        return {
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: 'root',
          database: 'OrderSync',
          entities: [Order, SyncJob, Job],
          synchronize: true,
          autoLoadEntities: true
        }
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    OrderModule
  ],
})
export class AppModule {}
