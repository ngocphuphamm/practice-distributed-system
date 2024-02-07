// rate-limiter.service.ts
import { Injectable } from '@nestjs/common';
import Bottleneck from 'bottleneck';

@Injectable()
export class RateLimiterService {
  private limiter: Bottleneck;

  constructor() {
    this.limiter = new Bottleneck({
      maxConcurrent: 1,
      minTime: 1000, // Chờ ít nhất 1 giây giữa mỗi yêu cầu
    });
  }

  async schedule<T>(fn: () => Promise<T>): Promise<T> {
    return this.limiter.schedule(fn);
  }
}
