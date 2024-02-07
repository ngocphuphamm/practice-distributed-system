// src/sync.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { SyncJob } from './entities/sync-jobs.entity';

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(SyncJob)
    private syncJobRepository: Repository<SyncJob>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>
  ) {}

  async createSyncJob(): Promise<SyncJob> {
    const syncJob = this.syncJobRepository.create({
      jobsCreated: 0,
      jobsCompleted: 0,
      status: 'pending',
    });
    return this.syncJobRepository.save(syncJob);
  }

  async incrementJobsCreated(syncJobId: number, number?: number): Promise<void> {
    await this.syncJobRepository.increment({ id: syncJobId }, 'jobsCreated', number | 1);
  }

  async incrementJobsCompleted(syncJobId: number, number?: number): Promise<void> {
    await this.syncJobRepository.increment(
      { id: syncJobId },
      'jobsCompleted',
      number || 1
    );
    const syncJob = await this.syncJobRepository.findOneBy({
      id: syncJobId,
    });
    if (syncJob.jobsCreated === syncJob.jobsCompleted) {
      syncJob.status = 'completed';
      await this.syncJobRepository.save(syncJob);
    }
  }


  // Add other methods to handle job failures, retries, and checks for sync completion
}
