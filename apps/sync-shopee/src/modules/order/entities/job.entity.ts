// src/job.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { SyncJob } from './sync-jobs.entity';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  jobType: string; // 'list', 'detail'

  @Column()
  jobStatus: string; // 'pending', 'completed', 'failed'

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @ManyToOne(() => SyncJob, syncJob => syncJob.jobs)
  syncJob: SyncJob;
}
