// order.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  shopeeOrderId: string;

}
