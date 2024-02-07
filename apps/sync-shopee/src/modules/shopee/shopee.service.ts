// shopee.service.ts
import { Injectable } from '@nestjs/common';
import { RateLimiterService } from './rate-limiter.service';
import axios from 'axios';

@Injectable()
export class ShopeeService {
  constructor(private rateLimiter: RateLimiterService) {}

  async fetchOrderDetails(orderId: string) {
    return this.rateLimiter.schedule(() => this.fetchDetails(orderId));
  }

  private async fetchDetails(orderId: string) {
    // Thực hiện gọi API Shopee tại đây
    console.log(`Fetching details for order ${orderId}`);
    // Ví dụ: const response = await axios.get(`https://api.shopee.com/orders/${orderId}`);
    return "Order details"; // Giả định response
  }
}
